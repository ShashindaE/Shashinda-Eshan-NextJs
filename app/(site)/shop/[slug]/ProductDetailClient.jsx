'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiteShell } from '../../../components/SiteShell'

export default function ProductDetailClient({ product }) {
  const [cart, setCart] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const variants = product.attributes || [] // Simplification for WooCommerce attributes
  const gallery = product.images || []
  const price = parseFloat(product.price || 0)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('shashinda_cart') || '[]')
      setCart(stored)
    } catch {}
  }, [])

  function addToCart() {
    const item = {
      productId: product.id,
      variantId: selectedVariant?.id || null,
      slug: product.slug,
      title: product.name + (selectedVariant ? ` — ${selectedVariant.name || ''}` : ''),
      price: price,
      quantity,
      image: gallery?.[0]?.src || null,
    }
    const existing = cart.find(
      c => c.productId === product.id && c.variantId === item.variantId
    )
    const next = existing
      ? cart.map(c =>
          c.productId === product.id && c.variantId === item.variantId
            ? { ...c, quantity: c.quantity + quantity }
            : c
        )
      : [...cart, item]
    setCart(next)
    localStorage.setItem('shashinda_cart', JSON.stringify(next))
    setAdded(true)
    setNotification(product.name)
    setTimeout(() => setNotification(null), 2000)
  }

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)

  return (
    <SiteShell>
      <div className="shop-page">
        {/* Header Area */}
        <div className="shop-hero">
          <div className="shop-hero-inner">
            <div>
              <p className="eyebrow">
                <Link href="/shop" className="shop-back-link">← Back to Shop</Link>
              </p>
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

        <div className="shop-container">
          <div className="shop-detail-grid premium">
            {/* Gallery */}
            <div className="shop-gallery">
              <div className="shop-gallery-main">
                {gallery.length > 0 ? (
                  <img
                    src={gallery[activeImage]?.src}
                    alt={product.name}
                    className="shop-gallery-main-img"
                  />
                ) : (
                  <div className="shop-gallery-placeholder">🖼️</div>
                )}
              </div>
              {gallery.length > 1 && (
                 <div className="shop-gallery-thumbs">
                  {gallery.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shop-gallery-thumb ${i === activeImage ? 'active' : ''}`}
                    >
                      <img src={g.src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="shop-detail-info">
              <h1 className="shop-detail-title">{product.name}</h1>

              <div className="shop-detail-price">
                Rs. {Number(price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </div>

              {/* Variants */}
              {variants.length > 0 && (
                <div className="shop-variants">
                  <div className="shop-variants-label">Options (Note: Advanced variables require setup)</div>
                  <div className="shop-variants-list">
                    {variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`shop-variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="shop-quantity">
                <div className="shop-variants-label">Quantity</div>
                <div className="shop-quantity-controls">
                  <button
                    className="shop-qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="shop-qty-val">{quantity}</span>
                  <button
                    className="shop-qty-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button className="shop-card-btn premium" onClick={addToCart}>
                Add to Cart <span>&#8599;</span>
              </button>

              {/* Description */}
              {product.description && (
                <div 
                  className="shop-detail-desc premium-desc"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
