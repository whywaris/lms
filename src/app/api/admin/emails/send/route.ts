import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendBatch, BatchEmailItem } from '@/lib/email/send'
import {
  announcementTemplate,
  newCoursesTemplate,
  formatAdminBody,
  formatAdminPlainText,
  CoursePreview,
} from '@/lib/email/templates'
import { unsubscribeUrl } from '@/lib/email/unsubscribe'

export async function POST(request: NextRequest) {
  try {
    // 1. Verify caller is a logged-in admin using regular server client
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin role required' }, { status: 403 })
    }

    // 2. Parse payload
    const bodyData = await request.json().catch(() => null)
    if (!bodyData) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const {
      audience = 'all',
      template = 'announcement',
      subject = '',
      body = '',
      courseIds = [],
    } = bodyData

    if (!subject.trim()) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 })
    }

    if (audience !== 'all' && audience !== 'free' && audience !== 'premium') {
      return NextResponse.json({ error: 'Invalid audience selected' }, { status: 400 })
    }

    const admin = createAdminClient()

    // 3. Query recipients server-side (never trust client)
    let query = admin
      .from('profiles')
      .select('id, full_name, email')
      .eq('is_active', true)
      .eq('email_opt_out', false)
      .not('email', 'is', null)

    if (audience === 'premium') {
      query = query.eq('plan', 'lifetime')
    } else if (audience === 'free') {
      query = query.or('plan.is.null,plan.neq.lifetime')
    }

    const { data: recipients, error: fetchErr } = await query

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 })
    }

    const recipientList = recipients || []
    const recipientCount = recipientList.length

    // Hard safety cap
    if (recipientCount > 500) {
      return NextResponse.json(
        {
          error: `Recipient count (${recipientCount}) exceeds the hard safety cap of 500. Campaign aborted for safety.`,
        },
        { status: 400 }
      )
    }

    if (recipientCount === 0) {
      return NextResponse.json(
        { error: 'No active recipients found for the selected audience.' },
        { status: 400 }
      )
    }

    // 4. Insert email_campaigns row with status 'sending'
    const { data: campaign, error: campaignInsertErr } = await admin
      .from('email_campaigns')
      .insert({
        subject: subject.trim(),
        template,
        audience,
        body,
        status: 'sending',
        recipients_count: recipientCount,
        sent_count: 0,
        failed_count: 0,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (campaignInsertErr || !campaign) {
      return NextResponse.json(
        { error: `Failed to create campaign record: ${campaignInsertErr?.message}` },
        { status: 500 }
      )
    }

    const campaignId = campaign.id

    // 5. Fetch courses if template is 'new_courses'
    let courses: CoursePreview[] = []
    if (template === 'new_courses') {
      if (courseIds && courseIds.length > 0) {
        const { data: selected } = await admin
          .from('public_courses')
          .select('course_name, slug, image_url')
          .in('id', courseIds)
          .limit(4)
        courses = selected || []
      }
      if (courses.length === 0) {
        const { data: latest } = await admin
          .from('public_courses')
          .select('course_name, slug, image_url')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(4)
        courses = latest || []
      }
    }

    // 6. Build personalized email for each recipient
    const batchItems: BatchEmailItem[] = []
    for (const recipient of recipientList) {
      const unsub = await unsubscribeUrl(recipient.id)
      const recipientName = recipient.full_name || undefined
      const formattedBody = formatAdminBody(body, recipientName)
      const plainTextBody = formatAdminPlainText(body, recipientName)

      let html = ''
      let text = ''

      if (template === 'new_courses') {
        const built = newCoursesTemplate({
          name: recipientName,
          courses,
          bodyHtml: formattedBody,
          bodyText: plainTextBody,
          unsubscribeUrl: unsub,
        })
        html = built.html
        text = built.text
      } else {
        const built = announcementTemplate({
          name: recipientName,
          subject: subject.trim(),
          bodyHtml: formattedBody,
          bodyText: plainTextBody,
          unsubscribeUrl: unsub,
        })
        html = built.html
        text = built.text
      }

      batchItems.push({
        to: recipient.email,
        subject: subject.trim(),
        html,
        text,
        unsubscribeUrl: unsub,
        campaignId,
        userId: recipient.id,
        template,
      })
    }

    // 7. Dispatch batch send
    const batchResult = await sendBatch(batchItems)

    const finalStatus = batchResult.sentCount > 0 ? 'sent' : 'failed'

    // 8. Update email_campaigns record
    await admin
      .from('email_campaigns')
      .update({
        sent_count: batchResult.sentCount,
        failed_count: batchResult.failedCount,
        status: finalStatus,
        sent_at: new Date().toISOString(),
      })
      .eq('id', campaignId)

    // 9. Write audit_logs entry
    try {
      await admin.from('audit_logs').insert({
        admin_email: user.email,
        action: `Sent email campaign: "${subject.trim()}" to ${audience} (${batchResult.sentCount} sent, ${batchResult.failedCount} failed)`,
      })
    } catch (auditErr) {
      console.error('[email/campaign] Failed to write audit log:', auditErr)
    }

    return NextResponse.json({
      ok: true,
      campaignId,
      recipientsCount: recipientCount,
      sentCount: batchResult.sentCount,
      failedCount: batchResult.failedCount,
      status: finalStatus,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    console.error('[api/admin/emails/send] Exception:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
