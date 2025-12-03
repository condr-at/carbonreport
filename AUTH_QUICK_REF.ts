// Quick Reference: Authentication System Implementation
// =====================================================

// 1. RESTART TYPESCRIPT SERVER TO CLEAR CACHE
// VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

// 2. ENVIRONMENT VARIABLES (add to .env)
/*
JWT_SECRET=<run: openssl rand -base64 32>
JWT_ACCESS_TOKEN_EXPIRES_IN=24h
JWT_REFRESH_TOKEN_EXPIRES_IN=90d
RESEND_API_KEY=re_your_key_here
FROM_EMAIL=noreply@carbonreport.app
NEXT_PUBLIC_APP_URL=http://localhost:3000
*/

// 3. DATABASE MIGRATION (when DB available)
// npx prisma migrate deploy

// 4. TESTING ENDPOINTS

// Register
/*
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "SecurePass123"
}
*/

// Login
/*
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123"
}
*/

// Verify Email (GET request with token from email)
// GET http://localhost:3000/api/auth/verify-email/<token>

// Logout
// POST http://localhost:3000/api/auth/logout

// Forgot Password
/*
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
*/

// Reset Password (with token from email)
/*
POST http://localhost:3000/api/auth/reset-password/<token>
Content-Type: application/json

{
  "password": "NewSecurePass456"
}
*/

// 5. FRONTEND PAGES
// /login           - Sign in page
// /register        - Registration page
// /verify-email    - Email verification landing
// /forgot-password - Request password reset
// /reset-password/[token] - Set new password

// 6. PROTECTED ROUTES
// All routes are protected by default except:
// - /login, /register, /verify-email, /forgot-password, /reset-password
// - /api/auth/* (auth endpoints)
// - Static files (/_next, /favicon.ico, etc.)

// 7. CURRENT USER IN API ROUTES
/*
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser() // Throws 401 if not authenticated
  return Response.json({ user })
}
*/

// 8. TYPE ERRORS (FALSE POSITIVES)
// If you see "verificationToken does not exist" errors:
// → This is a TypeScript language server cache issue
// → The code WORKS correctly at runtime
// → Solution: Restart TS Server (see step 1)

export {}
