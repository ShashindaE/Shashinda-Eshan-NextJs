import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudinaryStorage } from 'payload-cloudinary'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import dns from 'dns'

// Force IPv4 for DNS lookups — needed for Vercel → Supabase connectivity
// (Vercel resolves the Supabase hostname to IPv6 which is unreachable)
dns.setDefaultResultOrder('ipv4first')

import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '\u2014 Shashinda CMS',
    },
  },

  collections: [Users, Posts, Media, Categories, Tags],

  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET || 'change-me-to-a-secure-secret',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),

  plugins: [
    cloudinaryStorage({
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
      },
      collections: {
        media: true,
      },
    }),
  ],

  sharp,
})
