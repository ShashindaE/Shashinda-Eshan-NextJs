import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  return {
    title: `${slug} — Shop — Shashinda Eshan`,
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  let product = null

  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 3,
    })
    product = res.docs?.[0] || null
  } catch (err) {
    console.error('Failed to load product:', err)
  }

  if (!product) return notFound()

  return <ProductDetailClient product={product} />
}
