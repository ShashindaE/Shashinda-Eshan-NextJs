import { fetchWooCommerce } from './lib/woocommerce.js'

async function run() {
  console.log('Testing WooCommerce API...')
  try {
    const products = await fetchWooCommerce('/products?per_page=1')
    console.log(`Success! Found ${products.length} products.`)
    if (products.length > 0) {
      console.log('First product:', products[0].name, '- Price:', products[0].price)
    }
  } catch (error) {
    console.error('Test failed:', error.message)
  }
}

run()
