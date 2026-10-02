import type { NextConfig } from "next";
import { createClient } from '@supabase/supabase-js'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  async redirects() {
    const staticRedirects = [
      { source: '/course/:slug', destination: '/courses/:slug', permanent: true },
    ]

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { data } = await supabase.from('redirects').select('*')
      const dbRedirects = (data || []).map((r: { source: string; destination: string; is_permanent: boolean }) => ({
        source: r.source,
        destination: r.destination,
        permanent: r.is_permanent,
      }))
      return [...staticRedirects, ...dbRedirects]
    } catch {
      return staticRedirects
    }
  },
};

export default nextConfig;
