import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['tdafqulufqgmziamnrph.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tdafqulufqgmziamnrph.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
