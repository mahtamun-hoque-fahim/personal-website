'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_COOKIE = 'fahim_admin_session'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'fahim2024admin'

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string

  if (password === ADMIN_PASSWORD) {
    cookies().set(ADMIN_COOKIE, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    redirect('/admin')
  } else {
    redirect('/admin/login?error=1')
  }
}

export async function logoutAction() {
  cookies().delete(ADMIN_COOKIE)
  redirect('/admin/login')
}
