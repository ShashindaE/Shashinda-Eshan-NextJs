import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Turbopack from bundling packages that use native binaries or are CLI tools
  serverExternalPackages: [
    'sharp',
    'drizzle-kit',
    '@payloadcms/drizzle',
    '@payloadcms/db-postgres',
    'pg',
    'pg-native',
  ],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'shashinda.com',
      },
    ],
  },
}

export default withPayload(nextConfig)
