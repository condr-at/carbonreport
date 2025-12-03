import { createHash } from 'crypto'

export function hashContext(value: string) {
  return createHash('sha256').update(value).digest('hex')
}
