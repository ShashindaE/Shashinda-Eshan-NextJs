import { fetchWooCommerce } from '@/lib/woocommerce'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    
    // Create an order via WooCommerce API
    const orderData = {
      set_paid: false,
      billing: {
        email: body.email,
        first_name: 'Guest',
        last_name: 'Customer',
        address_1: 'N/A',
        city: 'N/A',
        country: 'LK'
      },
      line_items: body.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    }

    const order = await fetchWooCommerce('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })

    if (order.checkout_payment_url) {
      return NextResponse.json({ paymentUrl: order.checkout_payment_url })
    } else {
      throw new Error('WooCommerce did not return a checkout URL')
    }
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
