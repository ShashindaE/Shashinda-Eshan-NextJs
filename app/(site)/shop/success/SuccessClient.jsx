'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function SuccessClient() {
  useEffect(() => {
    // Clear the cart after successful purchase
    localStorage.removeItem('shashinda_cart')
  }, [])

  return (
    <div className="shop-page">
      <div className="shop-container">
        <div className="shop-result-page success">
          <div className="shop-result-icon">🎉</div>
          <h1 className="shop-result-title">Order Confirmed!</h1>
          <p className="shop-result-subtitle">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          <Link href="/shop" className="shop-card-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
