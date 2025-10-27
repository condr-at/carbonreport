import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(): string {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    vercelUrl ||
    'http://localhost:3000'
  )
}
