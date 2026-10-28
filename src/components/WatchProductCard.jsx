import { formatPrice } from '../data/products.js'

function WatchProductCard({ product, onDetails, onAdd, isWishlisted, onToggleWishlist }) {
  return (
    <article className="watch-card">
      <button
        className="watch-card-image"
        type="button"
        onClick={() => onDetails(product.id)}
        aria-label={`View ${product.name} details`}
      >
        <span className="watch-card-badge">{product.discount}% OFF</span>
        <img src={product.image} alt={`${product.brand} ${product.name}`} loading="lazy" />
      </button>
      <button
        className={`watch-wishlist ${isWishlisted ? 'is-wishlisted' : ''}`}
        type="button"
        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        onClick={() => onToggleWishlist(product.id)}
      >
        {isWishlisted ? '♥' : '♡'}
      </button>
      <div className="watch-card-content">
        <div className="watch-card-meta">
          <span>{product.brand}</span>
          <span className="watch-rating">★ {product.rating.toFixed(1)} <small>({product.reviewCount})</small></span>
        </div>
        <h3>{product.name}</h3>
        <p className="watch-model">{product.model} <span>·</span> {product.category} watch</p>
        <p className="watch-card-description">{product.description}</p>
        <div className="watch-color-line">
          <i className={`color-dot color-${product.color.toLowerCase().replace(/\s+/g, '-')}`} />
          <span>{product.color} · {product.strapColor} {product.strapMaterial}</span>
          <span className="watch-stock">{product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}</span>
        </div>
        <div className="watch-price-line">
          <strong>{formatPrice(product.price)}</strong>
          <del>{formatPrice(product.originalPrice)}</del>
          <span>{product.discount}% OFF</span>
        </div>
        <div className="watch-card-actions">
          <button type="button" className="watch-outline-button" onClick={() => onDetails(product.id)}>View Details</button>
          <button type="button" className="watch-add-button" disabled={product.stock < 1} onClick={() => onAdd(product)}>
            {product.stock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default WatchProductCard
