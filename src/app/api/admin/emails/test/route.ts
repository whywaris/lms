import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/send'
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
    // 1. Verify admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const bodyData = await request.json().catch(() => null)
    if (!bodyData) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const {
      template = 'announcement',
      subject = 'Test Email',
      body = '',
      courseIds = [],
    } = bodyData

    const adminName = profile.full_name || 'Admin'
    const dummyUnsub = await unsubscribeUrl(user.id)
    const formattedBody = formatAdminBody(body, adminName)
    const plainTextBody = formatAdminPlainText(body, adminName)

    let html = ''
    let text = ''

    if (template === 'new_courses') {
      const adminSupabase = createAdminClient()
      let courses: CoursePreview[] = []

      if (courseIds && courseIds.length > 0) {
        const { data: selectedCourses } = await adminSupabase
          .from('public_courses')
          .select('course_name, slug, image_url')
          .in('id', courseIds)
          .limit(4)
        courses = selectedCourses || []
      }

      if (courses.length === 0) {
        const { data: latestCourses } = await adminSupabase
          .from('public_courses')
          .select('course_name, slug, image_url')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(4)
        courses = latestCourses || []
      }

      const built = newCoursesTemplate({
        name: adminName,
        courses,
        bodyHtml: formattedBody,
        bodyText: plainTextBody,
        unsubscribeUrl: dummyUnsub,
      })
      html = built.html
      text = built.text
    } else {
      const built = announcementTemplate({
        name: adminName,
        subject: `[TEST] ${subject}`,
        bodyHtml: formattedBody,
        bodyText: plainTextBody,
        unsubscribeUrl: dummyUnsub,
      })
      html = built.html
      text = built.text
    }

    const sendRes = await sendEmail({
      to: user.email,
      subject: `[TEST] ${subject}`,
      html,
      text,
      userId: user.id,
      template: `test_${template}`,
    })

    if (!sendRes.ok) {
      return NextResponse.json({ error: sendRes.error || 'Failed to send test email' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: sendRes.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
