import { fetchWooCommerce } from './lib/woocommerce.js'

async function createSampleProduct() {
  console.log('Creating sample product...')
  
  const productData = {
    name: 'Premium Design Template',
    type: 'simple',
    regular_price: '25000',
    description: 'Elevate your online presence with this premium design template. Built for speed, accessibility, and modern aesthetics.',
    short_description: 'A modern, responsive design template.'
  }

  try {
    const response = await fetchWooCommerce('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
    
    console.log(`Success! Created product with ID: ${response.id}`)
    console.log(`View it here: ${response.permalink}`)
  } catch (error) {
    console.error('Failed to create product:', error.message)
  }
}

createSampleProduct()
