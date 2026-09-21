import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/send'
import { wrapLayout, escapeHtml } from '@/lib/email/templates'
import {
  SUPPORT_EMAIL,
  DMCA_EMAIL,
  RESPONSE_TIME,
  CONTACT_SUBJECTS,
} from '@/lib/contactConfig'

export const runtime = 'edge'

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */
async function sha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp.trim()
  const xForwarded = request.headers.get('x-forwarded-for')
  if (xForwarded) {
    const first = xForwarded.split(',')[0]
    if (first) return first.trim()
  }
  return '127.0.0.1'
}

/* ═══════════════════════════════════════════════════
   POST /api/contact
   ═══════════════════════════════════════════════════ */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const {
      firstName,
      lastName = '',
      email,
      phone = '',
      subject,
      message,
      website = '', // honeypot
      timestamp,
      turnstileToken = '',
    } = body

    // ── 1. Spam checks ──
    // Honeypot: if filled, return 200 without saving
    if (typeof website === 'string' && website.trim().length > 0) {
      return NextResponse.json({ ok: true })
    }

    // Timestamp check: if submitted in under 3 seconds, discard silently
    const clientTimestamp = Number(timestamp)
    if (clientTimestamp && Date.now() - clientTimestamp < 3000) {
      return NextResponse.json({ ok: true })
    }

    // Cloudflare Turnstile verification if secret key is present
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
    if (turnstileSecret) {
      if (!turnstileToken) {
        return NextResponse.json(
          { ok: false, error: 'Security verification required' },
          { status: 400 }
        )
      }
      try {
        const verifyRes = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              secret: turnstileSecret,
              response: turnstileToken,
              remoteip: getClientIp(request),
            }),
          }
        )
        const verifyData = (await verifyRes.json()) as { success: boolean }
        if (!verifyData.success) {
          return NextResponse.json(
            { ok: false, error: 'Security verification failed' },
            { status: 400 }
          )
        }
      } catch (tErr) {
        console.error('[contact/route] Turnstile verify error:', tErr)
        return NextResponse.json(
          { ok: false, error: 'Security verification error' },
          { status: 400 }
        )
      }
    }

    // ── 2. Validation ──
    const fieldErrors: Record<string, string> = {}

    const cleanFirstName = typeof firstName === 'string' ? firstName.trim() : ''
    const cleanLastName = typeof lastName === 'string' ? lastName.trim() : ''
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const cleanPhone = typeof phone === 'string' ? phone.trim() : ''
    const cleanSubject = typeof subject === 'string' ? subject.trim() : ''
    const cleanMessage = typeof message === 'string' ? message.trim() : ''

    if (!cleanFirstName || cleanFirstName.length > 60) {
      fieldErrors.firstName = 'First name must be between 1 and 60 characters'
    }

    if (
      !cleanEmail ||
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      fieldErrors.email = 'Please enter a valid email address'
    }

    if (cleanPhone.length > 30) {
      fieldErrors.phone = 'Phone number must be 30 characters or fewer'
    }

    if (!cleanSubject || !CONTACT_SUBJECTS.includes(cleanSubject as any)) {
      fieldErrors.subject = 'Please select a valid subject'
    }

    if (cleanMessage.length < 20 || cleanMessage.length > 2000) {
      fieldErrors.message = 'Message must be between 20 and 2000 characters'
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { ok: false, error: 'Validation failed', fields: fieldErrors },
        { status: 400 }
      )
    }

    // ── 3. Rate limiting ──
    const clientIp = getClientIp(request)
    const salt = process.env.UNSUBSCRIBE_SECRET || 'contact_salt'
    const ipHash = await sha256Hex(`${clientIp}:${salt}`)

    const supabase = createAdminClient()
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    try {
      const { count: recentCount, error: countErr } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneHourAgo)
        .or(`ip_hash.eq.${ipHash},email.eq.${cleanEmail}`)

      if (!countErr && recentCount !== null && recentCount >= 3) {
        return NextResponse.json(
          { ok: false, error: 'Too many messages. Please try again later.' },
          { status: 429 }
        )
      }
    } catch (rlErr) {
      console.error('[contact/route] Rate limit check error:', rlErr)
    }

    // ── 4. Insert row into contact_messages ──
    const userAgent = (request.headers.get('user-agent') || '').slice(0, 300)

    const { data: inserted, error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        first_name: cleanFirstName,
        last_name: cleanLastName || null,
        email: cleanEmail,
        phone: cleanPhone || null,
        subject: cleanSubject,
        message: cleanMessage,
        status: 'new',
        ip_hash: ipHash,
        user_agent: userAgent,
      })
      .select('id, created_at')
      .single()

    if (insertError || !inserted) {
      console.error('[contact/route] Supabase insert error:', insertError)
      return NextResponse.json(
        { ok: false, error: 'Unable to save your message. Please try again.' },
        { status: 500 }
      )
    }

    const messageId = inserted.id
    const receivedAt = new Date(inserted.created_at || Date.now()).toUTCString()

    // ── 5. Send two emails ──
    // a) To Support (or DMCA)
    const adminRecipient =
      cleanSubject === 'Copyright / DMCA notice' ? DMCA_EMAIL : SUPPORT_EMAIL

    const adminSubject = `[Contact] ${cleanSubject} - ${cleanFirstName}${cleanLastName ? ' ' + cleanLastName : ''}`

    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; line-height: 1.6; color: #1F2937;">
        <h2 style="color: #111827; margin: 0 0 16px;">New Contact Message Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #4B5563; width: 120px;">Name:</td>
            <td style="padding: 6px 0; color: #111827;">${escapeHtml(cleanFirstName)} ${escapeHtml(cleanLastName)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #4B5563;">Email:</td>
            <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(cleanEmail)}" style="color: #6B4EFF;">${escapeHtml(cleanEmail)}</a></td>
          </tr>
          ${
            cleanPhone
              ? `<tr>
            <td style="padding: 6px 0; font-weight: 600; color: #4B5563;">Phone:</td>
            <td style="padding: 6px 0; color: #111827;">${escapeHtml(cleanPhone)}</td>
          </tr>`
              : ''
          }
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #4B5563;">Subject:</td>
            <td style="padding: 6px 0; color: #111827; font-weight: 600;">${escapeHtml(cleanSubject)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #4B5563;">Message ID:</td>
            <td style="padding: 6px 0; color: #6B7280; font-family: monospace;">${escapeHtml(messageId)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #4B5563;">Received:</td>
            <td style="padding: 6px 0; color: #6B7280;">${escapeHtml(receivedAt)}</td>
          </tr>
        </table>
        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; font-size: 15px; color: #1F2937; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(cleanMessage)}</div>
      </div>
    `

    const adminText = `New Contact Form Message
Name: ${cleanFirstName} ${cleanLastName}
Email: ${cleanEmail}
${cleanPhone ? `Phone: ${cleanPhone}\n` : ''}Subject: ${cleanSubject}
Message ID: ${messageId}
Received: ${receivedAt}

Message:
${cleanMessage}`

    // b) To Customer (Transactional confirmation)
    const customerSubject = 'We received your message'
    const replyNotice = RESPONSE_TIME ? ` ${RESPONSE_TIME}` : ''

    const customerContentHtml = `
      <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        We received your message
      </h2>
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        Hi ${escapeHtml(cleanFirstName)}, thanks for contacting PandaCourses. We received your message about <strong>&ldquo;${escapeHtml(cleanSubject)}&rdquo;</strong> and will get back to you${escapeHtml(replyNotice)}.
      </p>
      <div style="margin: 20px 0; padding: 16px 20px; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; color: #4B5563; line-height: 1.6; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${escapeHtml(cleanMessage)}</div>
      <p style="margin: 20px 0 0 0; font-size: 14px; color: #6B7280; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        Need fast answers? Check our <a href="https://pandacourses.com/how-to-buy" style="color: #6B4EFF; text-decoration: underline;">How to Buy guide</a> or review our <a href="https://pandacourses.com/refund-policy" style="color: #6B4EFF; text-decoration: underline;">Refund Policy</a>.
      </p>
    `

    const customerHtml = wrapLayout({ contentHtml: customerContentHtml })
    const customerText = `Hi ${cleanFirstName}, thanks for contacting PandaCourses. We received your message about "${cleanSubject}" and will get back to you${replyNotice}.\n\nYour message:\n${cleanMessage}`

    // Dispatch emails concurrently without throwing (fail-safe: data is saved)
    await Promise.allSettled([
      sendEmail({
        to: adminRecipient,
        subject: adminSubject,
        html: adminHtml,
        text: adminText,
        replyTo: cleanEmail,
        template: 'contact_notification',
      }),
      sendEmail({
        to: cleanEmail,
        subject: customerSubject,
        html: customerHtml,
        text: customerText,
        template: 'contact_confirmation',
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact/route] Unhandled error:', err)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
