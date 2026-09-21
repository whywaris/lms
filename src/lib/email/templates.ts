/**
 * Table-based, mobile-friendly HTML email templates for PandaCourses.
 * Uses inline styles and client-safe CSS.
 */

export interface CoursePreview {
  course_name: string
  slug: string
  image_url?: string | null
}

export interface EmailTemplateResult {
  subject: string
  html: string
  text: string
}

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://pandacourses.com').replace(/\/+$/, '')
}

function getSupportEmail(): string {
  return process.env.EMAIL_REPLY_TO || 'support@pandacourses.com'
}

/**
 * Escapes HTML special characters to prevent injection.
 */
export function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Validates and sanitizes a URL.
 * Allows: http:, https:, mailto:
 * Prepends https:// if starts with www. or pandacourses.com
 * Returns null for any unsafe scheme (javascript:, data:, etc.).
 */
export function sanitizeUrl(rawUrl: string): string | null {
  if (!rawUrl) return null
  let trimmed = rawUrl.trim()

  // Prepend https:// for www. or pandacourses.com
  if (/^www\./i.test(trimmed)) {
    trimmed = `https://${trimmed}`
  } else if (/^pandacourses\.com(\/|$)/i.test(trimmed)) {
    trimmed = `https://${trimmed}`
  }

  // Only allow http://, https://, or mailto:
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    return trimmed
  }

  return null
}

/**
 * Auto-links raw URLs safely:
 * - https://...
 * - http://...
 * - www.example.com
 * - pandacourses.com/...
 */
function autoLinkRawUrls(escapedText: string): string {
  const rawUrlRegex = /\b(?:https?:\/\/[^\s<]+|www\.[^\s<]+|pandacourses\.com(?:\/[^\s<]*)?)/gi

  return escapedText.replace(rawUrlRegex, (matched) => {
    let cleanUrl = matched
    let trailing = ''
    while (cleanUrl.length > 0 && /[.,;:!?)\]'"]$/.test(cleanUrl)) {
      trailing = cleanUrl.slice(-1) + trailing
      cleanUrl = cleanUrl.slice(0, -1)
    }

    let targetHref = cleanUrl
    if (/^www\./i.test(targetHref) || /^pandacourses\.com/i.test(targetHref)) {
      targetHref = `https://${targetHref}`
    }

    const safeHref = sanitizeUrl(targetHref)
    if (!safeHref) {
      return matched
    }

    const escapedHref = escapeHtml(safeHref)
    return `<a href="${escapedHref}" target="_blank" rel="noopener noreferrer" style="color: #6B4EFF; text-decoration: underline;">${cleanUrl}</a>${trailing}`
  })
}

/**
 * Generates the clean plain-text version of the email body:
 * - Replaces {{name}} with recipient name (fallback "there")
 * - Buttons become "label: url"
 * - Links become "text (url)"
 * - Removes ** and _ markers
 */
export function formatAdminPlainText(plainText: string, name?: string): string {
  if (!plainText) return ''

  const safeName = name?.trim() || 'there'
  let text = plainText.replace(/{{\s*name\s*}}/gi, safeName)

  // 1. Buttons: [button: label](url) -> label: url
  text = text.replace(/\[button:\s*([^\]\r\n]+)\]\(([^)\r\n]+)\)/gi, (_, label, url) => {
    let cleanUrl = url.trim()
    if (/^www\./i.test(cleanUrl) || /^pandacourses\.com(\/|$)/i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`
    }
    return `${label.trim()}: ${cleanUrl}`
  })

  // 2. Links: [text](url) -> text (url)
  text = text.replace(/\[([^\]\r\n]+)\]\(([^)\r\n]+)\)/gi, (_, label, url) => {
    let cleanUrl = url.trim()
    if (/^www\./i.test(cleanUrl) || /^pandacourses\.com(\/|$)/i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`
    }
    return `${label.trim()} (${cleanUrl})`
  })

  // 3. Remove ** bold markers
  text = text.replace(/\*\*([\s\S]+?)\*\*/g, '$1')

  // 4. Remove _ italic markers
  text = text.replace(/(?<![a-zA-Z0-9])_([^_]+?)_(?![a-zA-Z0-9])/g, '$1')

  return text
}

/**
 * Builds safe HTML from admin-written plain text:
 * - Replaces {{name}} with provided name or "there".
 * - Escapes ALL other HTML to prevent injection.
 * - **bold text** -> <strong>bold text</strong>
 * - _italic text_ -> <em>italic text</em>
 * - [link text](url) -> inline link with brand purple, underlined, target="_blank", rel="noopener noreferrer"
 * - [button: Button label](url) -> centered, bulletproof table CTA button (#6B4EFF, 14px 28px, 8px radius, min-height 44px)
 * - Auto-links raw URLs (https://, http://, www., pandacourses.com)
 * - Blank line = new paragraph, single newline = <br />
 * - URL safety: only http:, https:, mailto: allowed (others render as plain text). Escapes quotes in href.
 */
export function formatAdminBody(plainText: string, name?: string): string {
  if (!plainText) return ''

  const safeName = name ? escapeHtml(name.trim()) : 'there'
  let text = plainText.replace(/{{\s*name\s*}}/gi, safeName)

  // Tokenize buttons [button: label](url)
  const buttonTokens: string[] = []
  text = text.replace(/\[button:\s*([^\]\r\n]+)\]\(([^)\r\n]+)\)/gi, (_, rawLabel, rawUrl) => {
    const safeUrl = sanitizeUrl(rawUrl)
    const tokenIndex = buttonTokens.length

    if (!safeUrl) {
      buttonTokens.push(escapeHtml(`${rawLabel.trim()}: ${rawUrl.trim()}`))
      return `@@EMAILBTN${tokenIndex}@@`
    }

    const safeLabel = escapeHtml(rawLabel.trim())
    const escapedHref = escapeHtml(safeUrl)

    const buttonHtml = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="border-radius: 8px; background-color: #6B4EFF;">
                  <a href="${escapedHref}" target="_blank" rel="noopener noreferrer" style="display: inline-block; min-height: 44px; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: bold; color: #FFFFFF; text-decoration: none; border-radius: 8px; background-color: #6B4EFF; box-sizing: border-box; text-align: center;">
                    ${safeLabel}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `.trim()

    buttonTokens.push(buttonHtml)
    return `@@EMAILBTN${tokenIndex}@@`
  })

  // Tokenize markdown links [text](url)
  const linkTokens: string[] = []
  text = text.replace(/\[([^\]\r\n]+)\]\(([^)\r\n]+)\)/gi, (_, rawLabel, rawUrl) => {
    const safeUrl = sanitizeUrl(rawUrl)
    const tokenIndex = linkTokens.length

    if (!safeUrl) {
      linkTokens.push(escapeHtml(`${rawLabel.trim()} (${rawUrl.trim()})`))
      return `@@EMAILLNK${tokenIndex}@@`
    }

    const safeLabel = escapeHtml(rawLabel.trim())
    const escapedHref = escapeHtml(safeUrl)

    const linkHtml = `<a href="${escapedHref}" target="_blank" rel="noopener noreferrer" style="color: #6B4EFF; text-decoration: underline;">${safeLabel}</a>`
    linkTokens.push(linkHtml)
    return `@@EMAILLNK${tokenIndex}@@`
  })

  function formatInline(str: string): string {
    let s = escapeHtml(str)
    // 1. Bold text: **bold** -> <strong>bold</strong>
    s = s.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
    // 2. Italic text: _italic_ -> <em>italic</em> (run BEFORE auto-linking so target="_blank" is not affected)
    s = s.replace(/(?<![a-zA-Z0-9])_([^_]+?)_(?![a-zA-Z0-9])/g, '<em>$1</em>')
    // 3. Auto-link raw URLs
    s = autoLinkRawUrls(s)
    // 4. Restore link tokens
    s = s.replace(/@@EMAILLNK(\d+)@@/g, (_, idx) => {
      return linkTokens[parseInt(idx, 10)] || ''
    })
    // 5. Single newlines to <br />
    s = s.replace(/\r?\n/g, '<br />')
    return s
  }

  // Split into paragraphs by blank lines
  const rawParagraphs = text.split(/\r?\n\s*\r?\n/)
  const outputParts: string[] = []

  for (const para of rawParagraphs) {
    const trimmed = para.trim()
    if (!trimmed) continue

    if (trimmed.includes('@@EMAILBTN')) {
      const parts = trimmed.split(/(@@EMAILBTN\d+@@)/g)
      for (const part of parts) {
        const pTrimmed = part.trim()
        if (!pTrimmed) continue

        const btnMatch = pTrimmed.match(/^@@EMAILBTN(\d+)@@$/)
        if (btnMatch) {
          const btnIndex = parseInt(btnMatch[1], 10)
          outputParts.push(buttonTokens[btnIndex] || '')
        } else {
          const formatted = formatInline(part.trim())
          if (formatted) {
            outputParts.push(`<p style="margin: 0 0 16px 0; line-height: 1.6; font-size: 15px; color: #374151; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${formatted}</p>`)
          }
        }
      }
    } else {
      const formatted = formatInline(trimmed)
      if (formatted) {
        outputParts.push(`<p style="margin: 0 0 16px 0; line-height: 1.6; font-size: 15px; color: #374151; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${formatted}</p>`)
      }
    }
  }

  return outputParts.join('')
}

/**
 * Base email layout wrapper with PandaCourses branding:
 * - Dark navy header with PandaCourses logo
 * - White card body with responsive max-width (600px)
 * - Clean footer with copyright, support contact, and optional Unsubscribe link
 */
export function wrapLayout({
  contentHtml,
  unsubscribeUrl,
}: {
  contentHtml: string
  unsubscribeUrl?: string
}): string {
  const siteUrl = getSiteUrl()
  const supportEmail = getSupportEmail()
  const currentYear = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>PandaCourses</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F3F4F6; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid-cell { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .mobile-btn { display: block !important; width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <center style="width: 100%; background-color: #F3F4F6; padding: 24px 0;">
    <!-- Main Email Container -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;" class="email-container">
      
      <!-- Header -->
      <tr>
        <td align="center" style="background-color: #1A1A2E; padding: 28px 24px; border-radius: 12px 12px 0 0;">
          <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size: 26px; font-weight: 700; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.5px;">
                  Panda<span style="color: #F97316;">Courses</span>
                </td>
              </tr>
            </table>
          </a>
        </td>
      </tr>

      <!-- Body Content -->
      <tr>
        <td style="background-color: #FFFFFF; padding: 36px 32px; border-left: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB;">
          ${contentHtml}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color: #FAFAFB; padding: 28px 24px; border: 1px solid #E5E7EB; border-top: 0; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #6B7280; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            &copy; ${currentYear} PandaCourses. All rights reserved.
          </p>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #9CA3AF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            Need help? Contact us anytime at <a href="mailto:${supportEmail}" style="color: #6B4EFF; text-decoration: underline;">${supportEmail}</a>
          </p>
          ${
            unsubscribeUrl
              ? `<p style="margin: 12px 0 0 0; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  You received this email because you are a registered PandaCourses learner. 
                  <br />
                  <a href="${unsubscribeUrl}" target="_blank" rel="noopener noreferrer" style="color: #6B7280; text-decoration: underline;">Unsubscribe from marketing emails</a>
                </p>`
              : ''
          }
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`
}

/**
 * 1. WELCOME EMAIL (Transactional — no unsubscribe)
 */
export function welcomeTemplate({ name }: { name?: string }): EmailTemplateResult {
  const siteUrl = getSiteUrl()
  const displayName = name ? escapeHtml(name.trim()) : 'there'
  const subject = 'Welcome to PandaCourses!'

  const contentHtml = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827; line-height: 1.3;">
      Welcome to PandaCourses, ${displayName}! 👋
    </h1>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #374151; line-height: 1.6;">
      Thank you for joining our community! We are excited to have you on board. Here is what you can do right now to get started:
    </p>

    <!-- Benefit List -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 28px 0;">
      <tr>
        <td style="padding: 10px 0; vertical-align: top; width: 28px; font-size: 18px;">📚</td>
        <td style="padding: 10px 0; font-size: 14px; color: #374151; line-height: 1.5;">
          <strong>Explore Courses:</strong> Browse hundreds of premium curated courses covering tech, business, design, and more.
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; vertical-align: top; width: 28px; font-size: 18px;">⚡</td>
        <td style="padding: 10px 0; font-size: 14px; color: #374151; line-height: 1.5;">
          <strong>Student Dashboard:</strong> Access all your saved courses and downloadable materials in one centralized hub.
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; vertical-align: top; width: 28px; font-size: 18px;">💎</td>
        <td style="padding: 10px 0; font-size: 14px; color: #374151; line-height: 1.5;">
          <strong>Lifetime Value:</strong> Unlock the full catalog forever with our simple one-time lifetime pass.
        </td>
      </tr>
    </table>

    <!-- Call to Action Buttons -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: #6B4EFF; padding: 0;">
          <a href="${siteUrl}/dashboard" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 8px; background-color: #6B4EFF;">
            Go to Dashboard &rarr;
          </a>
        </td>
        <td style="width: 16px;"></td>
        <td align="center" style="border-radius: 8px; background-color: #F3F4F6; padding: 0;">
          <a href="${siteUrl}/courses" target="_blank" style="display: inline-block; padding: 14px 24px; font-size: 15px; font-weight: 500; color: #374151; text-decoration: none; border-radius: 8px; border: 1px solid #D1D5DB; background-color: #F3F4F6;">
            Browse Courses
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; color: #6B7280; line-height: 1.5;">
      If you have any questions, simply reply to this email. We're here to help you succeed!
    </p>
  `

  const text = `Welcome to PandaCourses, ${displayName}!\n\n` +
    `Thank you for joining our community. Here is what you can do right now:\n` +
    `- Explore Courses: ${siteUrl}/courses\n` +
    `- Go to your Dashboard: ${siteUrl}/dashboard\n\n` +
    `If you have any questions, contact us at ${getSupportEmail()}.\n\n` +
    `© ${new Date().getFullYear()} PandaCourses`

  return {
    subject,
    html: wrapLayout({ contentHtml }),
    text,
  }
}

/**
 * 2. PLAN ACTIVATED EMAIL (Transactional — no unsubscribe)
 */
export function planActivatedTemplate({ name }: { name?: string }): EmailTemplateResult {
  const siteUrl = getSiteUrl()
  const displayName = name ? escapeHtml(name.trim()) : 'there'
  const subject = 'Your Lifetime Access is Active! 🎉'

  const contentHtml = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827; line-height: 1.3;">
      Your Lifetime Access is Active! 🎉
    </h1>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${displayName}, your account has been upgraded to <strong>Lifetime Access</strong>. You now have complete, permanent access to the entire PandaCourses library.
    </p>

    <!-- Checklist Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F7FF; border: 1px solid #E9D5FF; border-radius: 8px; padding: 20px; margin: 0 0 28px 0;">
      <tr>
        <td>
          <h2 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #4C1D95;">
            What is included in your Lifetime membership:
          </h2>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #374151;">✅ <strong>All Courses Included:</strong> Immediate access to every published course.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #374151;">✅ <strong>Fast Downloads:</strong> Direct Mega.nz & Google Drive links inside your dashboard.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #374151;">✅ <strong>Future Updates:</strong> Access to all newly published courses automatically.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #374151;">✅ <strong>No Subscriptions:</strong> One-time payment, yours forever.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: #6B4EFF; padding: 0;">
          <a href="${siteUrl}/dashboard" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 8px; background-color: #6B4EFF;">
            Open Dashboard &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; color: #6B7280; line-height: 1.5;">
      Happy learning! If you ever need assistance or course recommendations, our support team is always ready to help.
    </p>
  `

  const text = `Hi ${displayName},\n\n` +
    `Your Lifetime Access to PandaCourses is now active!\n\n` +
    `Here is what is included:\n` +
    `- All courses included\n` +
    `- Mega and Google Drive direct links\n` +
    `- Future updates and new course releases\n` +
    `- No subscriptions ever\n\n` +
    `Open your dashboard to start learning: ${siteUrl}/dashboard\n\n` +
    `© ${new Date().getFullYear()} PandaCourses`

  return {
    subject,
    html: wrapLayout({ contentHtml }),
    text,
  }
}

/**
 * 3. ANNOUNCEMENT EMAIL (Marketing — includes unsubscribe)
 */
export function announcementTemplate({
  name,
  subject,
  bodyHtml,
  bodyText,
  rawBody,
  unsubscribeUrl,
}: {
  name?: string
  subject: string
  bodyHtml?: string
  bodyText?: string
  rawBody?: string
  unsubscribeUrl?: string
}): EmailTemplateResult {
  const contentHtml = `
    <div style="margin: 0 0 24px 0;">
      ${bodyHtml || (rawBody ? formatAdminBody(rawBody, name) : '')}
    </div>
  `

  let textContent = bodyText
  if (!textContent && rawBody) {
    textContent = formatAdminPlainText(rawBody, name)
  }
  if (!textContent && bodyHtml) {
    textContent = bodyHtml.replace(/<[^>]+>/g, '').trim()
  }

  const text = `${subject}\n\n` +
    (textContent || '') +
    (unsubscribeUrl ? `\n\nUnsubscribe: ${unsubscribeUrl}` : '')

  return {
    subject,
    html: wrapLayout({ contentHtml, unsubscribeUrl }),
    text,
  }
}

/**
 * 4. NEW COURSES EMAIL (Marketing — includes unsubscribe)
 */
export function newCoursesTemplate({
  name,
  courses,
  bodyHtml,
  bodyText,
  unsubscribeUrl,
}: {
  name?: string
  courses: CoursePreview[]
  bodyHtml?: string
  bodyText?: string
  unsubscribeUrl?: string
}): EmailTemplateResult {
  const siteUrl = getSiteUrl()
  const displayName = name ? escapeHtml(name.trim()) : 'there'
  const subject = 'New Courses Added to PandaCourses! 🚀'

  const courseListHtml = (courses || [])
    .slice(0, 4)
    .map((c) => {
      const courseUrl = `${siteUrl}/course/${c.slug}`
      const title = escapeHtml(c.course_name)
      const thumbnail = c.image_url
        ? `<img src="${c.image_url}" alt="${title}" width="140" height="90" style="width: 140px; height: 90px; object-fit: cover; border-radius: 8px; display: block;" />`
        : `<div style="width: 140px; height: 90px; background-color: #EEF2FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 28px; text-align: center; line-height: 90px;">📚</div>`

      return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; overflow: hidden;">
          <tr>
            <td width="140" style="vertical-align: top; padding: 12px;">
              ${thumbnail}
            </td>
            <td style="vertical-align: middle; padding: 12px 16px 12px 4px;">
              <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #111827; line-height: 1.4;">
                ${title}
              </h3>
              <a href="${courseUrl}" target="_blank" style="display: inline-block; font-size: 13px; font-weight: 600; color: #6B4EFF; text-decoration: underline;">
                View Course &rarr;
              </a>
            </td>
          </tr>
        </table>
      `
    })
    .join('')

  const contentHtml = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827; line-height: 1.3;">
      Exciting New Courses Are Here! 🚀
    </h1>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${displayName}, check out the latest additions to the PandaCourses library:
    </p>

    ${bodyHtml ? `<div style="margin-bottom: 24px;">${bodyHtml}</div>` : ''}

    <!-- Course Cards -->
    <div style="margin-bottom: 28px;">
      ${courseListHtml}
    </div>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: #6B4EFF; padding: 0;">
          <a href="${siteUrl}/courses" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 8px; background-color: #6B4EFF;">
            Explore All Courses &rarr;
          </a>
        </td>
      </tr>
    </table>
  `

  const text = `Hi ${displayName},\n\n` +
    `New courses have just been added to PandaCourses!\n\n` +
    (bodyText ? `${bodyText}\n\n` : '') +
    courses.map(c => `- ${c.course_name}: ${siteUrl}/course/${c.slug}`).join('\n') +
    `\n\nExplore all courses: ${siteUrl}/courses\n` +
    (unsubscribeUrl ? `\nUnsubscribe: ${unsubscribeUrl}` : '')

  return {
    subject,
    html: wrapLayout({ contentHtml, unsubscribeUrl }),
    text,
  }
}
