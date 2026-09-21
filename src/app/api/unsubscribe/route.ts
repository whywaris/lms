import { NextRequest, NextResponse } from 'next/server'
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let token = searchParams.get('token')

    if (!token) {
      const body = await request.json().catch(() => null)
      token = body?.token
    }

    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 400 })
    }

    const { valid, userId } = await verifyUnsubscribeToken(token)

    if (!valid || !userId) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .update({ email_opt_out: true })
      .eq('id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Unsubscribed successfully' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
