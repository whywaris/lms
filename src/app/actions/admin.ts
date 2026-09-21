'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { planActivatedTemplate } from '@/lib/email/templates'
import { sendEmail } from '@/lib/email/send'

export async function deleteBlogPost(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * Sends a plan_activated transactional email to a member when their plan
 * is upgraded or assigned to 'lifetime'.
 * Non-blocking: returns { ok, error } and never throws.
 */
export async function sendPlanActivatedEmail({
  userId,
  email,
  name,
}: {
  userId: string
  email: string
  name?: string | null
}): Promise<{ ok: boolean; error?: string }> {
  try {
    // 1. Verify caller is admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: 'Unauthorized' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { ok: false, error: 'Forbidden: Admin role required' }
    }

    if (!email) return { ok: false, error: 'Recipient email missing' }

    // 2. Generate template
    const template = planActivatedTemplate({ name: name || undefined })

    // 3. Send email
    const res = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      userId,
      template: 'plan_activated',
    })

    return { ok: res.ok, error: res.error }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[actions/admin] Error in sendPlanActivatedEmail:', msg)
    return { ok: false, error: msg }
  }
}
