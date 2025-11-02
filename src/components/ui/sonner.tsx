'use client';

import { Toaster as SonnerToaster } from 'sonner';

export type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export function Toaster({ position = 'top-right', richColors = true, ...props }: ToasterProps) {
  return <SonnerToaster position={position} richColors={richColors} {...props} />;
}
