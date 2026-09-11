'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ShopPageClient({ products }) {
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('shashinda_cart') || '[]')
      setCart(stored)
    } catch {}
  }, [])

  function addToCart(product) {
    const price = (product.priceInLKR ?? 0) / 100
    const item = {
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price,
      quantity: 1,
      image: product.gallery?.[0]?.image?.url || null,
    }
    const existing = cart.find(c => c.productId === product.id)
    const next = existing
      ? cart.map(c => c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c)
      : [...cart, item]
    setCart(next)
    localStorage.setItem('shashinda_cart', JSON.stringify(next))
    setNotification(product.title)
    setTimeout(() => setNotification(null), 2500)
  }

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-header">
        <div className="shop-header-inner">
          <div>
            <h1 className="shop-title">Shop</h1>
            <p className="shop-subtitle">Curated products by Shashinda Eshan</p>
          </div>
          <Link href="/shop/cart" className="shop-cart-btn">
            🛒 Cart {cartCount > 0 && <span className="shop-cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Notification toast */}
      {notification && (
        <div className="shop-toast">
          ✓ Added <strong>{notification}</strong> to cart
        </div>
      )}

      {/* Product Grid */}
      <div className="shop-container">
        {products.length === 0 ? (
          <div className="shop-empty">
            <div className="shop-empty-icon">🛍️</div>
            <h2>Coming Soon</h2>
            <p>Products will be available here shortly.</p>
          </div>
        ) : (
          <div className="shop-grid">
            {products.map(product => {
              const price = (product.priceInLKR ?? 0) / 100
              const image = product.gallery?.[0]?.image?.url || null
              return (
                <div key={product.id} className="shop-card">
                  <Link href={`/shop/${product.slug}`} className="shop-card-image-link">
                    {image ? (
                      <img src={image} alt={product.title} className="shop-card-image" />
                    ) : (
                      <div className="shop-card-placeholder">🖼️</div>
                    )}
                  </Link>
                  <div className="shop-card-body">
                    <Link href={`/shop/${product.slug}`} className="shop-card-title">
                      {product.title}
                    </Link>
                    <div className="shop-card-price">
                      Rs. {Number(price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </div>
                    <button
                      className="shop-card-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
