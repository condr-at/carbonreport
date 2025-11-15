'use client';

import { request, ApiError } from '@/lib/api-client';
import { MAX_UPLOAD_SIZE_BYTES, listSupportedMimeTypes } from '@/lib/uploads';
import type { UploadResourceType } from '@/lib/uploads/resource-types';

export type { UploadResourceType } from '@/lib/uploads/resource-types';

type PostUploadInstruction = {
  method: 'POST'
  url: string
  fields: Record<string, string>
}

type PutUploadInstruction = {
  method: 'PUT'
  url: string
  headers: Record<string, string>
}

type UploadInstruction = (PostUploadInstruction | PutUploadInstruction) & {
  asset_id: string
  expires_at: string
  relay_path?: string
}

export type SignedUploadResponse = {
  upload: UploadInstruction
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

async function uploadViaRelay(upload: UploadInstruction, file: File) {
  if (!upload.relay_path) {
    return
  }

  const relayFormData = new FormData()
  relayFormData.append('file', file)
  relayFormData.append('upload', JSON.stringify(upload))

  const relayResponse = await fetch(upload.relay_path, {
    method: 'POST',
    body: relayFormData,
  })

  if (!relayResponse.ok) {
    throw new UploadError('Failed to upload file via relay.', relayResponse.status)
  }
}

async function performUpload(upload: UploadInstruction, file: File) {
  if (upload.relay_path) {
    await uploadViaRelay(upload, file)
    return
  }

  if (upload.method === 'POST') {
    const formData = new FormData();
    Object.entries(upload.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('file', file);

    const response = await fetch(upload.url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new UploadError('Failed to upload file to storage.', response.status);
    }
    return
  }

  const response = await fetch(upload.url, {
    method: 'PUT',
    headers: upload.headers,
    body: file,
  });

  if (!response.ok) {
    throw new UploadError('Failed to upload file to storage.', response.status);
  }
}

export async function uploadAsset(resourceType: UploadResourceType, file: File) {
  assertFileConstraints(file);

  const { upload } = await requestSignedUpload(resourceType, file);
  await performUpload(upload, file);

  return {
    assetId: upload.asset_id,
    expiresAt: upload.expires_at,
  };
}
