/**
 * Resend HTTP API Client for PandaCourses.
 * Edge / Cloudflare compatible — uses native fetch only (no npm packages).
 * Direct endpoints:
 * - https://api.resend.com/emails
 * - https://api.resend.com/emails/batch
 */

import { createAdminClient } from '@/lib/supabase/admin'

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  tags?: { name: string; value: string }[]
  unsubscribeUrl?: string
  campaignId?: string | null
  userId?: string | null
  template?: string
  replyTo?: string
}

export interface SendEmailResult {
  ok: boolean
  id?: string
  error?: string
}

export interface BatchEmailItem {
  to: string
  subject: string
  html: string
  text?: string
  unsubscribeUrl?: string
  campaignId?: string | null
  userId?: string | null
  template?: string
}

export interface BatchSendResult {
  results: {
    to: string
    ok: boolean
    id?: string
    error?: string
    userId?: string | null
  }[]
  sentCount: number
  failedCount: number
}

function getApiKey(): string {
  return process.env.RESEND_API_KEY || ''
}

function getFromAddress(): string | undefined {
  const from = process.env.EMAIL_FROM?.trim()
  return from || undefined
}

function getReplyToAddress(): string | undefined {
  const replyTo = process.env.EMAIL_REPLY_TO?.trim()
  return replyTo || undefined
}

/**
 * Send a single email via Resend and record a row in email_logs.
 * Never throws — catches and returns { ok, id, error }.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  tags,
  unsubscribeUrl,
  campaignId = null,
  userId = null,
  template = 'transactional',
  replyTo: replyToOverride,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = getApiKey()
  const from = getFromAddress()
  let ok = false
  let resendId: string | undefined = undefined
  let errorMsg: string | undefined = undefined

  if (!apiKey) {
    errorMsg = 'Missing RESEND_API_KEY environment variable'
    console.error('[email/send]', errorMsg)
  } else if (!from) {
    errorMsg = 'EMAIL_FROM is not set'
    console.error('[email/send] EMAIL_FROM is not set')
  } else {
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }

      const emailHeaders: Record<string, string> = {}
      if (unsubscribeUrl) {
        emailHeaders['List-Unsubscribe'] = `<${unsubscribeUrl}>`
        emailHeaders['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'
      }

      const payload: Record<string, unknown> = {
        from,
        to: [to],
        subject,
        html,
      }

      const replyTo = replyToOverride || getReplyToAddress()
      if (replyTo) payload.reply_to = replyTo
      if (text) payload.text = text
      if (tags && tags.length > 0) payload.tags = tags
      if (Object.keys(emailHeaders).length > 0) payload.headers = emailHeaders

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)

      if (res.ok && data?.id) {
        ok = true
        resendId = data.id
      } else {
        ok = false
        errorMsg = data?.message || data?.error || `Resend HTTP error ${res.status}: ${res.statusText}`
        console.error('[email/send] Resend error response:', data)
      }
    } catch (err: unknown) {
      ok = false
      errorMsg = err instanceof Error ? err.message : String(err)
      console.error('[email/send] Fetch exception:', err)
    }
  }

  // Log in email_logs using Supabase Admin Client
  try {
    const supabase = createAdminClient()
    await supabase.from('email_logs').insert({
      campaign_id: campaignId,
      user_id: userId,
      to_email: to,
      template,
      subject,
      status: ok ? 'sent' : 'failed',
      resend_id: resendId || null,
      error: errorMsg || null,
    })
  } catch (logErr) {
    console.error('[email/send] Failed to write email_logs:', logErr)
  }

  return { ok, id: resendId, error: errorMsg }
}

/**
 * Send a batch of emails via Resend /emails/batch in chunks of 100.
 * Waits ~600ms between chunks to respect the 2 requests/second rate limit.
 * Every recipient is logged in email_logs.
 */
export async function sendBatch(emails: BatchEmailItem[]): Promise<BatchSendResult> {
  const apiKey = getApiKey()
  const from = getFromAddress()
  const replyTo = getReplyToAddress()
  const results: BatchSendResult['results'] = []

  if (!emails || emails.length === 0) {
    return { results: [], sentCount: 0, failedCount: 0 }
  }

  if (!apiKey) {
    const err = 'Missing RESEND_API_KEY environment variable'
    console.error('[email/batch]', err)
    for (const item of emails) {
      results.push({
        to: item.to,
        ok: false,
        error: err,
        userId: item.userId,
      })
    }
    // Write failed logs
    try {
      const supabase = createAdminClient()
      const logRows = emails.map((item) => ({
        campaign_id: item.campaignId || null,
        user_id: item.userId || null,
        to_email: item.to,
        template: item.template || 'announcement',
        subject: item.subject,
        status: 'failed',
        resend_id: null,
        error: err,
      }))
      await supabase.from('email_logs').insert(logRows)
    } catch (e) {
      console.error('[email/batch] Failed to log batch error:', e)
    }
    return { results, sentCount: 0, failedCount: emails.length }
  }

  if (!from) {
    const err = 'EMAIL_FROM is not set'
    console.error('[email/batch] EMAIL_FROM is not set')
    for (const item of emails) {
      results.push({
        to: item.to,
        ok: false,
        error: err,
        userId: item.userId,
      })
    }
    // Write failed logs
    try {
      const supabase = createAdminClient()
      const logRows = emails.map((item) => ({
        campaign_id: item.campaignId || null,
        user_id: item.userId || null,
        to_email: item.to,
        template: item.template || 'announcement',
        subject: item.subject,
        status: 'failed',
        resend_id: null,
        error: err,
      }))
      await supabase.from('email_logs').insert(logRows)
    } catch (e) {
      console.error('[email/batch] Failed to log batch error:', e)
    }
    return { results, sentCount: 0, failedCount: emails.length }
  }

  const CHUNK_SIZE = 100
  let sentTotal = 0
  let failedTotal = 0

  for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
    const chunk = emails.slice(i, i + CHUNK_SIZE)

    // Build batch payload
    const batchPayload = chunk.map((item) => {
      const headers: Record<string, string> = {}
      if (item.unsubscribeUrl) {
        headers['List-Unsubscribe'] = `<${item.unsubscribeUrl}>`
        headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'
      }

      const emailObj: Record<string, unknown> = {
        from,
        to: [item.to],
        subject: item.subject,
        html: item.html,
      }
      if (replyTo) emailObj.reply_to = replyTo
      if (item.text) emailObj.text = item.text
      if (Object.keys(headers).length > 0) emailObj.headers = headers

      return emailObj
    })

    let batchResponseData: any = null
    let batchError: string | null = null

    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchPayload),
      })

      batchResponseData = await res.json().catch(() => null)

      if (!res.ok) {
        batchError = batchResponseData?.message || batchResponseData?.error || `Resend batch HTTP error ${res.status}`
      }
    } catch (err: unknown) {
      batchError = err instanceof Error ? err.message : String(err)
    }

    // Process chunk results
    const logRows: any[] = []
    const returnedItems = Array.isArray(batchResponseData?.data) ? batchResponseData.data : null

    for (let idx = 0; idx < chunk.length; idx++) {
      const item = chunk[idx]
      let itemOk = false
      let itemId: string | undefined = undefined
      let itemErr: string | undefined = batchError || undefined

      if (!batchError && returnedItems && returnedItems[idx]) {
        const resItem = returnedItems[idx]
        if (resItem.id) {
          itemOk = true
          itemId = resItem.id
        } else if (resItem.error) {
          itemOk = false
          itemErr = resItem.error.message || JSON.stringify(resItem.error)
        }
      } else if (!batchError && !returnedItems) {
        itemOk = false
        itemErr = batchResponseData?.message || 'Unknown batch response format'
      }

      if (itemOk) sentTotal++
      else failedTotal++

      results.push({
        to: item.to,
        ok: itemOk,
        id: itemId,
        error: itemErr,
        userId: item.userId,
      })

      logRows.push({
        campaign_id: item.campaignId || null,
        user_id: item.userId || null,
        to_email: item.to,
        template: item.template || 'announcement',
        subject: item.subject,
        status: itemOk ? 'sent' : 'failed',
        resend_id: itemId || null,
        error: itemErr || null,
      })
    }

    // Batch insert email_logs
    try {
      const supabase = createAdminClient()
      await supabase.from('email_logs').insert(logRows)
    } catch (logErr) {
      console.error('[email/batch] Failed to insert email_logs:', logErr)
    }

    // Delay 600ms if there are more chunks remaining
    if (i + CHUNK_SIZE < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, 600))
    }
  }

  return {
    results,
    sentCount: sentTotal,
    failedCount: failedTotal,
  }
}
