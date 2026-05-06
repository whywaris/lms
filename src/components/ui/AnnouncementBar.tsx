import { createClient } from '@/lib/supabase/server'

export default async function AnnouncementBar() {
  try {
    const supabase = await createClient()

    const { data: announcement } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!announcement) return null

    return (
      <div style={{
        background: 'var(--color-brand-navy)',
        color: 'var(--color-on-dark)',
        padding: '10px 32px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '500',
        fontFamily: 'var(--font-sans)',
        lineHeight: '1.5',
      }}>
        {announcement.text}
      </div>
    )
  } catch {
    return null
  }
}
