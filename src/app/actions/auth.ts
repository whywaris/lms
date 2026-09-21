'use server'

import { sendWelcomeIfNeeded } from '@/lib/email/welcome'

export async function triggerWelcomeEmail(userId: string) {
  if (!userId) return false
  return await sendWelcomeIfNeeded(userId)
}
