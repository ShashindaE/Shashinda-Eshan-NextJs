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

      // Enable products with variant support + custom display fields
      products: {
        variants: true,
        productsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          admin: {
            ...defaultCollection.admin,
            useAsTitle: 'title',
            defaultColumns: ['title', 'priceInLKR', '_status'],
          },
          fields: [
            // Display fields added before the plugin's price/inventory fields
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Product Name',
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              label: 'URL Slug',
              admin: { position: 'sidebar', description: 'Auto-generated from title if left blank.' },
              hooks: {
                beforeValidate: [
                  ({ value, data }: { value: string; data: Record<string, unknown> }) => {
                    if (!value && data?.title) {
                      return String(data.title)
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Product Images',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media' as const,
                  required: true,
                },
              ],
            },
            // Spread plugin's default fields (prices, inventory, variants)
            ...defaultCollection.fields,
          ],
        }),
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
