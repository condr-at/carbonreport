'use client';

import type { ExternalToast } from 'sonner';
import { toast } from 'sonner';

type NotificationOptions = ExternalToast;

type Action = NonNullable<ExternalToast['action']>;

type PromiseMessages<T> = {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: unknown) => string);
};

function resolveMessage<T>(message: string | ((value: T) => string), value: T): string {
  return typeof message === 'function' ? message(value) : message;
}

export const notifications = {
  success(message: string, options?: NotificationOptions) {
    toast.success(message, options);
  },
  error(message: string, options?: NotificationOptions) {
    toast.error(message, options);
  },
  info(message: string, options?: NotificationOptions) {
    toast(message, options);
  },
  action(message: string, action: Action, options?: NotificationOptions) {
    toast(message, { ...options, action });
  },
  async promise<T>(promise: Promise<T>, messages: PromiseMessages<T>, options?: NotificationOptions) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: (data) => resolveMessage(messages.success, data),
      error: (error) => resolveMessage(messages.error, error),
      ...options,
    });
  },
};
