import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    // 1. Verify admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Parse audience
    const { searchParams } = new URL(request.url)
    const audience = searchParams.get('audience') || 'all'

    const admin = createAdminClient()
    let query = admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('email_opt_out', false)
      .not('email', 'is', null)

    if (audience === 'premium') {
      query = query.eq('plan', 'lifetime')
    } else if (audience === 'free') {
      query = query.or('plan.is.null,plan.neq.lifetime')
    }

    const { count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
