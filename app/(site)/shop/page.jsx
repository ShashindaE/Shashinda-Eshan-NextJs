import { getPayload } from 'payload'
import configPromise from '@payload-config'
import ShopPageClient from './ShopPageClient'

export const metadata = {
  title: 'Shop — Shashinda Eshan',
  description: 'Browse handpicked products by Shashinda Eshan.',
}

export const revalidate = 60

export default async function ShopPage() {
  let products = []

  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'products',
      where: { _status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 100,
      depth: 2,
    })
    products = res.docs || []
  } catch (err) {
    console.error('Failed to load products in ShopPage:', err)
  }

  return <ShopPageClient products={products} />
}
