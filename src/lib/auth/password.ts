import bcrypt from 'bcryptjs'

const DEFAULT_ROUNDS = 12

function getRounds() {
  const envValue = process.env.BCRYPT_ROUNDS
  if (!envValue) {
    return DEFAULT_ROUNDS
  }

  const parsed = Number(envValue)
  if (!Number.isFinite(parsed) || parsed < 10) {
    return DEFAULT_ROUNDS
  }

  return Math.min(parsed, 15)
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, getRounds())
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function meetsPasswordPolicy(password: string) {
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)

  return hasMinLength && hasUppercase && hasLowercase && hasDigit
}
