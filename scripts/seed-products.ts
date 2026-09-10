/**
 * Seed sample products into Payload via the local API.
 * Run with: npx tsx scripts/seed-products.ts
 */
import { getPayload } from 'payload'
import configPromise from '../payload.config'

const sampleProducts = [
  {
    title: 'Brand Strategy Guide',
    slug: 'brand-strategy-guide',
    description:
      'A comprehensive step-by-step PDF guide on building a powerful personal or business brand from scratch. Covers positioning, messaging, visual identity, and launch strategy.',
    priceInLKR: 4500,
    inventory: 999,
    _status: 'published' as const,
  },
  {
    title: 'Logo Design Consultation (1 Hour)',
    slug: 'logo-design-consultation-1hr',
    description:
      'Book a one-on-one 60-minute strategy session to discuss your logo, brand direction, or design challenges. Delivered via Google Meet with a follow-up summary.',
    priceInLKR: 8500,
    inventory: 10,
    _status: 'published' as const,
  },
  {
    title: 'Social Media Visual Kit',
    slug: 'social-media-visual-kit',
    description:
      'A ready-to-use Canva template pack — 30 professionally designed posts, stories, and highlight covers tailored for creative professionals and personal brands.',
    priceInLKR: 2990,
    inventory: 999,
    _status: 'published' as const,
  },
  {
    title: 'Full Brand Identity Package',
    slug: 'full-brand-identity-package',
    description:
      'Everything you need for a cohesive brand: logo suite, colour palette, typography guide, brand guidelines PDF, and 5 social media templates. Delivered within 7 days.',
    priceInLKR: 35000,
    inventory: 5,
    _status: 'published' as const,
  },
  {
    title: 'Website Audit Report',
    slug: 'website-audit-report',
    description:
      'A detailed professional audit of your existing website covering UX, SEO fundamentals, visual design, load speed, and conversion opportunities — with actionable recommendations.',
    priceInLKR: 6500,
    inventory: 20,
    _status: 'published' as const,
  },
]

async function seed() {
  const payload = await getPayload({ config: configPromise })

  console.log(`\n🌱 Seeding ${sampleProducts.length} sample products…\n`)

  for (const product of sampleProducts) {
    try {
      // Check if already exists
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: product.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭  Skipped (already exists): ${product.title}`)
        continue
      }

      await payload.create({
        collection: 'products',
        data: product,
      })
      console.log(`  ✓  Created: ${product.title} — Rs. ${product.priceInLKR.toLocaleString('en-LK')}`)
    } catch (err) {
      console.error(`  ✗  Failed: ${product.title}`, err)
    }
  }

  console.log('\n✅ Seeding complete!\n')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
