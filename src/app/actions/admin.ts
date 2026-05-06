'use server'

import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function deleteBlogPost(id: string) {
  const { error } = await adminClient().from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
