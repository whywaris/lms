'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function deleteBlogPost(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
