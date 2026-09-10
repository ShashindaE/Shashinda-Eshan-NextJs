'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProductDetailClient({ product }) {
  const [cart, setCart] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const variants = product.variants?.docs || product.variants || []
  const gallery = product.gallery || []
  const price = selectedVariant?.priceInLKR ?? product.priceInLKR ?? 0

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
      title: product.title + (selectedVariant ? ` — ${selectedVariant.title || ''}` : ''),
      price: Number(product.priceInLKR ?? 0),
      quantity,
      image: gallery?.[0]?.image?.url || null,
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
    setTimeout(() => setAdded(false), 2000)
  }

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)

  return (
    <div className="shop-page">
      {/* Header bar */}
      <div className="shop-header">
        <div className="shop-header-inner">
          <Link href="/shop" className="shop-back-link">← Back to Shop</Link>
          <Link href="/shop/cart" className="shop-cart-btn">
            🛒 Cart {cartCount > 0 && <span className="shop-cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <div className="shop-container">
        <div className="shop-detail-grid">
          {/* Gallery */}
          <div className="shop-gallery">
            <div className="shop-gallery-main">
              {gallery.length > 0 ? (
                <img
                  src={gallery[activeImage]?.image?.url}
                  alt={product.title}
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
                    <img src={g.image?.url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="shop-detail-info">
            <h1 className="shop-detail-title">{product.title}</h1>

            <div className="shop-detail-price">
              Rs. {Number(price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="shop-variants">
                <div className="shop-variants-label">Options</div>
                <div className="shop-variants-list">
                  {variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`shop-variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="shop-quantity">
              <div className="shop-variants-label">Quantity</div>
              <div className="shop-quantity-controls">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="shop-qty-btn">−</button>
                <span className="shop-qty-val">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="shop-qty-btn">+</button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={addToCart}
              className={`shop-add-to-cart-btn ${added ? 'added' : ''}`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>

            <Link href="/shop/cart" className="shop-checkout-link">
              View Cart & Checkout →
            </Link>

            {/* Description */}
            {product.description && (
              <div className="shop-detail-desc">
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
