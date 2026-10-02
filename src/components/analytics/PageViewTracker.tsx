'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PageViewTrackerProps {
  path: string
  pageType: 'course' | 'blog' | 'other'
  slug: string
}

export default function PageViewTracker({ path, pageType, slug }: PageViewTrackerProps) {
  const loggedRef = useRef(false)

  useEffect(() => {
    if (loggedRef.current) return
    loggedRef.current = true

    async function logView() {
      try {
        if (typeof window === 'undefined') return

        // 1. Skip known bots & crawlers
        const userAgent = navigator.userAgent || ''
        const isBot = /bot|googlebot|crawler|spider|robot|crawling|bingbot|duckduckbot|slurp|baiduspider|yandex/i.test(
          userAgent
        )
        if (isBot) return

        const supabase = createClient()

        // 2. Skip admin users
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          if (profile?.role === 'admin') {
            return
          }
        }

        // 3. Insert page view record
        await supabase.from('page_views').insert({
          path,
          page_type: pageType,
          slug,
        })
      } catch {
        // Non-blocking: silently ignore errors
      }
    }

    logView()
  }, [path, pageType, slug])

  return null
}
