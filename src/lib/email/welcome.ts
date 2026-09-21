/**
 * Welcome Email Trigger Helper
 * Sends a welcome email exactly once per user.
 * Non-blocking: never throws into the auth or registration flow.
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/send'
import { welcomeTemplate } from '@/lib/email/templates'

export async function sendWelcomeIfNeeded(userId: string): Promise<boolean> {
  if (!userId) return false

  try {
    const supabase = createAdminClient()

    // 1. Fetch profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, welcome_email_sent_at')
      .eq('id', userId)
      .single()

    if (error || !profile || !profile.email) {
      return false
    }

    // 2. Check if already sent
    if (profile.welcome_email_sent_at) {
      return false
    }

    // 3. Generate template
    const template = welcomeTemplate({ name: profile.full_name || undefined })

    // 4. Send email
    const res = await sendEmail({
      to: profile.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      userId: profile.id,
      template: 'welcome',
    })

    // 5. If successful, record timestamp
    if (res.ok) {
      await supabase
        .from('profiles')
        .update({ welcome_email_sent_at: new Date().toISOString() })
        .eq('id', userId)
      return true
    }

    return false
  } catch (err) {
    console.error('[email/welcome] Non-blocking exception in sendWelcomeIfNeeded:', err)
    return false
  }
}
