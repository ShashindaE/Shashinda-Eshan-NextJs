'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiteShell } from '../../components/SiteShell'

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
    const price = parseFloat(product.price || 0)
    const item = {
      productId: product.id,
      slug: product.slug,
      title: product.name,
      price,
      quantity: 1,
      image: product.images?.[0]?.src || null,
    }
    const existing = cart.find(c => c.productId === product.id)
    const next = existing
      ? cart.map(c => c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c)
      : [...cart, item]
    setCart(next)
    localStorage.setItem('shashinda_cart', JSON.stringify(next))
    setNotification(product.name)
    setTimeout(() => setNotification(null), 2500)
  }

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)

  return (
    <SiteShell>
      <div className="shop-page">
        {/* Header Area */}
        <div className="shop-hero">
          <div className="shop-hero-inner">
            <div>
              <p className="eyebrow">Store <i /> Curated Products</p>
              <h1>The <em>Shop</em></h1>
            </div>
            <Link href="/shop/cart" className="shop-cart-btn-premium">
              <span className="cart-icon">🛒</span> 
              <span className="cart-text">Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
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
                const price = parseFloat(product.price || 0)
                const image = product.images?.[0]?.src || null
                return (
                  <div key={product.id} className="shop-card premium">
                    <Link href={`/shop/${product.slug}`} className="shop-card-image-link">
                      {image ? (
                        <img src={image} alt={product.name} className="shop-card-image" />
                      ) : (
                        <div className="shop-card-placeholder">🖼️</div>
                      )}
                    </Link>
                    <div className="shop-card-body">
                      <Link href={`/shop/${product.slug}`} className="shop-card-title">
                        {product.name}
                      </Link>
                      <div className="shop-card-price">
                        Rs. {Number(price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </div>
                      <button
                        className="shop-card-btn"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart <span>&#8599;</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  )
}
