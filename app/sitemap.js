import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function sitemap() {
  const baseUrl = 'https://shashinda.com'
  
  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    // Fetch dynamic blog posts from Payload
    const payload = await getPayload({ config: await configPromise })
    const posts = await payload.find({
      collection: 'posts',
      limit: 100,
      depth: 0,
      where: {
        _status: { equals: 'published' }
      }
    })

    if (posts && posts.docs) {
      posts.docs.forEach((post) => {
        if (post.slug) {
          routes.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        }
      })
    }
  } catch (error) {
    console.warn('Could not fetch posts for sitemap:', error)
  }

  try {
    // Fetch WooCommerce products
    const url = process.env.WOOCOMMERCE_URL
    const key = process.env.KEY
    const secret = process.env.SECRET

    if (url && key && secret) {
      const authHeader = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
      const res = await fetch(`${url}/wp-json/wc/v3/products?status=publish&per_page=100`, {
        headers: {
          'Authorization': authHeader
        }
      })
      
      if (res.ok) {
        const products = await res.json()
        products.forEach((product) => {
          if (product.slug) {
            routes.push({
              url: `${baseUrl}/shop/${product.slug}`,
              lastModified: product.date_modified ? new Date(product.date_modified) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            })
          }
        })
      }
    }
  } catch (error) {
    console.warn('Could not fetch products for sitemap:', error)
  }

  return routes
}
