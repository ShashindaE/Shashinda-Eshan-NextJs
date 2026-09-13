export async function fetchWooCommerce(endpoint, options = {}) {
  const url = process.env.WOOCOMMERCE_URL
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET

  if (!url || !consumerKey || !consumerSecret) {
    throw new Error('WooCommerce API credentials are not set in environment variables.')
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
  const headers = {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  // Remove trailing slash if it exists and ensure endpoint starts with /
  const baseUrl = url.replace(/\/$/, '')
  const fetchUrl = `${baseUrl}/wp-json/wc/v3${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const response = await fetch(fetchUrl, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('WooCommerce API Error:', response.status, response.statusText, errorBody)
    throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getProducts(queryParams = '') {
  // e.g. "?status=publish&per_page=100"
  return fetchWooCommerce(`/products${queryParams}`)
}

export async function getProductBySlug(slug) {
  const products = await fetchWooCommerce(`/products?slug=${slug}`)
  return products.length > 0 ? products[0] : null
}
