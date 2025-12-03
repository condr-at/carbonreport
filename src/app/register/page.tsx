import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { isApiError } from '@/lib/api-error'
import { RegisterForm } from './register-form'

export default async function RegisterPage() {
  try {
    await getCurrentUser()
    redirect('/dashboard')
  } catch (error) {
    if (!isApiError(error) || error.status !== 401) {
      throw error
    }
  }

  return <RegisterForm />
}
