'use client';

import { fetchWithSession } from '@/lib/session-client';
import { request, ApiError } from '@/lib/api-client';
import { MAX_UPLOAD_SIZE_BYTES, listSupportedMimeTypes } from '@/lib/uploads';
import type { UploadResourceType } from '@/lib/uploads/resource-types';

export type { UploadResourceType } from '@/lib/uploads/resource-types';

export type SignedUploadResponse = {
  upload: {
    asset_id: string;
    url: string;
    fields: Record<string, string>;
    expires_at: string;
  };
};

export class UploadError extends Error {
  status?: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'UploadError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function assertFileConstraints(file: File) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new UploadError('File is larger than 512 KB.', 413, 'VALIDATION_ERROR', {
      max_bytes: MAX_UPLOAD_SIZE_BYTES,
      size: file.size,
    });
  }

  if (!file.type) {
    throw new UploadError('File type is missing. Please choose PNG, JPEG, or SVG.');
  }

  const supported = listSupportedMimeTypes();
  if (!supported.includes(file.type as (typeof supported)[number])) {
    throw new UploadError('Unsupported file type. Allowed: PNG, JPEG, SVG.', 415, 'VALIDATION_ERROR', {
      supported,
      provided: file.type,
    });
  }
}

async function requestSignedUpload(resourceType: UploadResourceType, file: File) {
  try {
    return await request<SignedUploadResponse>('/api/uploads/sign', {
      method: 'POST',
      body: JSON.stringify({
        resource_type: resourceType,
        file_name: file.name,
        mime_type: file.type,
        file_size_bytes: file.size,
      }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw new UploadError(error.message, error.status, error.code, error.details);
    }
    throw error;
  }
}

async function performUpload(upload: SignedUploadResponse['upload'], file: File) {
  const formData = new FormData();
  Object.entries(upload.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);

  try {
    const response = await fetch(upload.url, {
      method: 'POST',
      body: formData,
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new UploadError('Failed to upload file to storage.', response.status);
    }
  } catch (error) {
    if (error instanceof UploadError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new UploadError('Network error while uploading file.', undefined, 'NETWORK_ERROR', {
        message: error.message,
      });
    }

    throw error;
  }
}

async function relayUpload(upload: SignedUploadResponse['upload'], file: File) {
  const formData = new FormData();
  formData.append('assetId', upload.asset_id);
  formData.append('url', upload.url);
  formData.append('fields', JSON.stringify(upload.fields));
  formData.append('file', file);

  try {
    const response = await fetchWithSession('/api/uploads/relay', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = typeof payload?.error === 'string' ? payload.error : 'Upload relay failed.';
      throw new UploadError(message, response.status, payload?.code, payload?.details ?? payload);
    }
  } catch (error) {
    if (error instanceof UploadError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new UploadError('Upload relay failed: network error.', undefined, 'NETWORK_ERROR', {
        message: error.message,
      });
    }

    throw error;
  }
}

export async function uploadAsset(resourceType: UploadResourceType, file: File) {
  assertFileConstraints(file);

  const { upload } = await requestSignedUpload(resourceType, file);
  try {
    await performUpload(upload, file);
  } catch (error) {
    if (error instanceof UploadError && error.code === 'NETWORK_ERROR') {
      await relayUpload(upload, file);
    } else {
      throw error;
    }
  }

  return {
    assetId: upload.asset_id,
    expiresAt: upload.expires_at,
  };
}
