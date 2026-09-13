import { getProducts } from '@/lib/woocommerce'
import ShopPageClient from './ShopPageClient'

export const metadata = {
  title: 'Shop — Shashinda Eshan',
  description: 'Browse handpicked products by Shashinda Eshan.',
}

export const revalidate = 60

export default async function ShopPage() {
  let products = []

  try {
    products = await getProducts('?status=publish&per_page=100')
  } catch (err) {
    console.error('Failed to load products from WooCommerce in ShopPage:', err)
  }

  return <ShopPageClient products={products} />
}
