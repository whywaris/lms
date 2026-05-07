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
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { data } = await supabase.from('redirects').select('*')
      return (data || []).map((r: { source: string; destination: string; is_permanent: boolean }) => ({
        source: r.source,
        destination: r.destination,
        permanent: r.is_permanent,
      }))
    } catch {
      return []
    }
  },
};

export default nextConfig;
