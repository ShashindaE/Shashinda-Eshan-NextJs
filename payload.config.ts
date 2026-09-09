import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudinaryStorage } from 'payload-cloudinary'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'
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
    // Auto-push schema changes without interactive prompts (safe for dev + Supabase)
    push: true,
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

    ecommercePlugin({
      // Access control — simple open rules; products are public, admin manages everything
      access: {
        adminOnlyFieldAccess: () => false,
        adminOrPublishedStatus: () => true,
        isAdmin: ({ req }) => Boolean(req.user),
        isAuthenticated: ({ req }) => Boolean(req.user),
        isDocumentOwner: ({ req }) => {
          if (!req.user) return false
          return { customer: { equals: req.user.id } }
        },
      },

      // Map customers to the existing Users collection
      customers: {
        slug: 'users',
      },

      // LKR — Sri Lankan Rupee (0 decimal places in Stripe, 2 displayed)
      currencies: {
        defaultCurrency: 'LKR',
        supportedCurrencies: [
          {
            code: 'LKR',
            decimals: 2,
            label: 'Sri Lankan Rupee',
            symbol: 'Rs.',
          },
        ],
      },

      // Enable products with variant support (size, color etc.)
      products: {
        variants: true,
      },

      // Enable orders, carts, addresses, transactions
      orders: true,
      carts: true,
      addresses: true,
      transactions: true,

      // Wire up Stripe
      payments: {
        paymentMethods: [
          stripeAdapter({
            secretKey: process.env.STRIPE_SECRET_KEY || '',
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
          }),
        ],
      },
    }),
  ],

  sharp,
})
