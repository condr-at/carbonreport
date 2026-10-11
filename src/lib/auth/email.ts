import { Resend } from 'resend'

/** `sent` means accepted for sending, not confirmed inbox delivery. */
export type EmailDeliveryResult = { status: 'sent' | 'not_sent' }

async function sendEmail(to: string, subject: string, html: string): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('Email sending is unavailable: missing configuration')
    return { status: 'not_sent' }
  }

  try {
    const result = await new Resend(apiKey).emails.send({
      from: process.env.FROM_EMAIL ?? 'Carbon Report <noreply@carbonreport.app>',
      to,
      subject,
      html,
    })
    if (result.error || !result.data?.id) {
      console.warn('Email request was not accepted for sending')
      return { status: 'not_sent' }
    }
    return { status: 'sent' }
  } catch {
    console.warn('Email request could not be completed')
    return { status: 'not_sent' }
  }
}

export async function sendVerificationEmail(params: { to: string; name?: string | null; link: string }) {
  const { to, name, link } = params
  const subject = 'Verify your Carbon Report email'
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>${greeting}</p>
      <p>Thanks for signing up for Carbon Report. Please confirm your email address by clicking the button below.</p>
      <p style="margin: 32px 0;">
        <a href="${link}" target="_blank" rel="noopener" style="background-color:#16a34a;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;">
          Verify email
        </a>
      </p>
      <p>If you didn’t create an account, you can safely ignore this email.</p>
      <p>— Carbon Report Team</p>
    </div>
  `

  return sendEmail(to, subject, html)
}

export async function sendPasswordResetEmail(params: { to: string; link: string }) {
  const { to, link } = params
  const subject = 'Reset your Carbon Report password'
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>We received a request to reset your Carbon Report password.</p>
      <p style="margin: 32px 0;">
        <a href="${link}" target="_blank" rel="noopener" style="background-color:#16a34a;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;">
          Reset password
        </a>
      </p>
      <p>If you did not make this request, you can ignore this email and your password will stay the same.</p>
      <p>This link will expire shortly for your security.</p>
      <p>— Carbon Report Team</p>
    </div>
  `

  return sendEmail(to, subject, html)
}
