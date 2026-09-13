import { getProductBySlug } from '@/lib/woocommerce'
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
    product = await getProductBySlug(slug)
  } catch (err) {
    console.error('Failed to load product:', err)
  }

  if (!product) return notFound()

  return <ProductDetailClient product={product} />
}
