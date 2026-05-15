'use server'

import { createContactMessage } from '@/lib/db/queries'

type Result =
  | { ok: true }
  | { ok: false; error: string }

type ContactInput = {
  name: string
  email: string
  subject: string
  message: string
  country?: string | null
}

export async function submitContactMessage(input: ContactInput): Promise<Result> {
  const name = input.name?.trim()
  const email = input.email?.trim()
  const message = input.message?.trim()
  const subject = input.subject?.trim() ?? ''
  const country = input.country?.trim() || null

  if (!name || !email || !message) {
    return { ok: false, error: 'Name, email, and message are required.' }
  }

  // basic email shape
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  try {
    await createContactMessage({ name, email, subject, message, country })
    return { ok: true }
  } catch (error) {
    console.error('submitContactMessage error:', error)
    return { ok: false, error: 'Something went wrong. Please email me directly.' }
  }
}
