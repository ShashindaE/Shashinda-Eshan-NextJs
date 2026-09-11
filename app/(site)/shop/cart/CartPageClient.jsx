'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

// Inner checkout form rendered inside <Elements>
function CheckoutForm({ clientSecret, cart, customerEmail, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/shop/success`,
      },
    })
    if (confirmError) {
      setError(confirmError.message)
      setLoading(false)
    }
    // If no error, Stripe redirects to /shop/success
  }

  return (
    <form onSubmit={handleSubmit} className="shop-payment-form">
      <PaymentElement />
      {error && <div className="shop-payment-error">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="shop-pay-btn"
      >
        {loading ? 'Processing…' : `Pay Rs. ${cart.reduce((s,i) => s + i.price * i.quantity, 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
      </button>
    </form>
  )
}

export default function CartPageClient() {
  const [cart, setCart] = useState([])
  const [email, setEmail] = useState('')
  const [clientSecret, setClientSecret] = useState(null)
  const [initiating, setInitiating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('shashinda_cart') || '[]')
      setCart(stored)
    } catch {}
  }, [])

  function updateQty(idx, delta) {
    const next = cart
      .map((item, i) => i === idx ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
      .filter(item => item.quantity > 0)
    setCart(next)
    localStorage.setItem('shashinda_cart', JSON.stringify(next))
  }

  function removeItem(idx) {
    const next = cart.filter((_, i) => i !== idx)
    setCart(next)
    localStorage.setItem('shashinda_cart', JSON.stringify(next))
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  async function initiateCheckout() {
    if (!email) { setError('Please enter your email address.'); return }
    if (cart.length === 0) return
    setInitiating(true)
    setError(null)

    try {
      // Step 1: Create a Payload cart document so we have a real cartID
      const cartRes = await fetch('/api/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency: 'LKR',
          items: cart.map(i => ({
            product: i.productId,
            ...(i.variantId ? { variant: i.variantId } : {}),
            quantity: i.quantity,
          })),
        }),
      })
      const cartData = await cartRes.json()
      if (!cartRes.ok) {
        throw new Error(
          cartData?.errors?.[0]?.message || cartData?.message || 'Failed to create cart'
        )
      }

      const cartID = cartData?.doc?.id
      const cartSecret = cartData?.doc?.secret // only present if guest cart
      if (!cartID) throw new Error('Cart creation did not return an ID')

      // Step 2: Initiate payment with the real cartID
      const res = await fetch('/api/payments/stripe/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartID,
          ...(cartSecret ? { secret: cartSecret } : {}),
          customerEmail: email,
          billingAddress: {
            line1: 'N/A',
            city: 'N/A',
            country: 'LK',
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || data?.message || 'Checkout failed')
      setClientSecret(data.clientSecret)
    } catch (err) {
      setError(err.message)
    } finally {
      setInitiating(false)
    }
  }

  if (cart.length === 0 && !clientSecret) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <div className="shop-header-inner">
            <Link href="/shop" className="shop-back-link">← Back to Shop</Link>
          </div>
        </div>
        <div className="shop-container">
          <div className="shop-empty">
            <div className="shop-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started.</p>
            <Link href="/shop" className="shop-card-btn" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="shop-header-inner">
          <Link href="/shop" className="shop-back-link">← Back to Shop</Link>
          <h1 className="shop-title" style={{ fontSize: '1.4rem' }}>Your Cart</h1>
        </div>
      </div>

      <div className="shop-container">
        <div className="shop-cart-layout">
          {/* Cart items */}
          {!clientSecret && (
            <div className="shop-cart-items">
              {cart.map((item, idx) => (
                <div key={idx} className="shop-cart-item">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="shop-cart-item-img" />
                  )}
                  <div className="shop-cart-item-info">
                    <div className="shop-cart-item-title">{item.title}</div>
                    <div className="shop-cart-item-price">
                      Rs. {Number(item.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="shop-quantity-controls" style={{ marginTop: '0.5rem' }}>
                      <button onClick={() => updateQty(idx, -1)} className="shop-qty-btn">−</button>
                      <span className="shop-qty-val">{item.quantity}</span>
                      <button onClick={() => updateQty(idx, 1)} className="shop-qty-btn">+</button>
                      <button onClick={() => removeItem(idx)} className="shop-remove-btn">Remove</button>
                    </div>
                  </div>
                  <div className="shop-cart-item-subtotal">
                    Rs. {(item.price * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary & payment */}
          <div className="shop-cart-summary">
            <div className="shop-cart-summary-title">Order Summary</div>

            {cart.map((item, idx) => (
              <div key={idx} className="shop-summary-line">
                <span>{item.title} × {item.quantity}</span>
                <span>Rs. {(item.price * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}

            <div className="shop-summary-total">
              <span>Total</span>
              <span>Rs. {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>

            {error && <div className="shop-payment-error">{error}</div>}

            {!clientSecret ? (
              <>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="shop-email-input"
                />
                <button
                  onClick={initiateCheckout}
                  disabled={initiating}
                  className="shop-pay-btn"
                >
                  {initiating ? 'Preparing…' : 'Proceed to Payment'}
                </button>
              </>
            ) : (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: 'night' } }}
              >
                <CheckoutForm
                  clientSecret={clientSecret}
                  cart={cart}
                  customerEmail={email}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
