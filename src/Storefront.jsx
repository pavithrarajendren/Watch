import { useEffect, useMemo, useState } from 'react'
import WatchAssistant from './components/WatchAssistant.jsx'
import WatchProductCard from './components/WatchProductCard.jsx'
import OfferTimer from './components/OfferTimer'
import {
  brands,
  categories,
  colors,
  dialColors,
  formatPrice,
  priceRanges,
  styles,
  strapMaterials,
  watchProducts,
} from './data/products.js'
import './storefront.css'

const CART_KEY = 'maison-noir-cart'
const WISHLIST_KEY = 'maison-noir-wishlist'

function getRoute() {
  const [path, anchor = ''] = window.location.hash.replace(/^#\/?/, '').split('#')
  const [page = 'home', id = ''] = path.split('/')
  return { page, id, anchor }
}

function readList(key, validate) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(stored) ? stored.filter(validate) : []
  } catch {
    return []
  }
}

function StoreNav({ route, user, cartCount, onLogout }) {
  const links = [
    { href: '#/home', label: 'Home', page: 'home' },
    { href: '#/products', label: 'Watches', page: 'products' },
    { href: '#/home#collections', label: 'Collections', page: 'home' },
    { href: '#/home#about', label: 'About', page: 'home' },
    { href: '#/home#contact', label: 'Contact', page: 'home' },
  ]

  return (
    <header className="watch-store-nav">
      <a className="watch-store-logo" href="#/home"><span>M</span> MAISON <i>NOIR</i></a>
      <nav aria-label="Store navigation">
        {links.map((link) => (
          <a
            href={link.href}
            className={route.page === link.page && ((route.page === 'products' && link.page === 'products') || (route.page === 'home' && link.label === 'Home')) ? 'nav-active' : ''}
            key={link.label}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="watch-nav-account">
          <a className="watch-wishlist-link" href="#/wishlist" aria-label="View wishlist">♡ <span>Saved</span></a>
          <a className="watch-cart-link" href="#/cart" aria-label={`Cart, ${cartCount} items`}>
            <span aria-hidden="true">♧</span> Cart <b>{cartCount}</b>
          </a>
          <span className="watch-user-name">{user.fullName || user.email}</span>
          <button type="button" onClick={onLogout}>Logout</button>
      </div>
    </header>
  )
}

function HomeProductSection({ eyebrow, title, products, onDetails, onAdd, wishlisted, onToggleWishlist, id }) {
  return (
    <section className="watch-home-featured" id={id}>
      <div className="watch-section-title">
        <div><p className="watch-eyebrow">{eyebrow}</p><h2>{title}</h2></div>
        <a href="#/products">VIEW ALL WATCHES ↗</a>
      </div>
      <div className="watch-product-grid watch-feature-grid">
        {products.map((product) => (
          <WatchProductCard
            key={product.id}
            product={product}
            onDetails={onDetails}
            onAdd={onAdd}
            isWishlisted={wishlisted.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  )
}

function WatchHome({ onDetails, onAdd, wishlisted, onToggleWishlist }) {
  const featured = [...watchProducts].sort((a, b) => b.rating - a.rating).slice(0, 4)
  const newest = [...watchProducts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4)
  const bestSellers = [...watchProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 4)

  return (
    <main>
      <section className="watch-home-hero">
        <div className="watch-home-copy">
          <p className="watch-eyebrow">MAISON NOIR · THE ART OF EVERYDAY</p>
          <h1>Timeless design.<br /><em>Modern precision.</em></h1>
          <p>Discover independent watchmakers and considered timepieces, selected for the way you live.</p>
          <div className="watch-hero-actions">
            <a className="watch-primary-link" href="#/products">SHOP COLLECTION <span>↗</span></a>
            <a className="watch-secondary-link" href="#/products">EXPLORE WATCHES</a>
          </div>
          <small>COMPLIMENTARY SHIPPING · TWO-YEAR WARRANTY</small>
        </div>
        <div className="watch-home-art">
          <div className="watch-home-glow" />
          <img src={watchProducts[1].image} alt={`${watchProducts[1].brand} ${watchProducts[1].name} luxury watch`} />
          <span>FEATURED · {watchProducts[1].model}</span>
        </div>
      </section>
      <OfferTimer />
      <section className="watch-value-strip"><span>DESIGNED TO LAST</span><i /><span>INDEPENDENT WATCHMAKERS</span><i /><span>COMPLIMENTARY SHIPPING</span></section>
      <HomeProductSection eyebrow="THE MAISON EDIT" title="Featured watches" products={featured} onDetails={onDetails} onAdd={onAdd} wishlisted={wishlisted} onToggleWishlist={onToggleWishlist} id="collections" />
      <HomeProductSection eyebrow="JUST ARRIVED" title="New arrivals" products={newest} onDetails={onDetails} onAdd={onAdd} wishlisted={wishlisted} onToggleWishlist={onToggleWishlist} />
      {[
        { category: 'Luxury', title: 'Luxury Collection', eyebrow: 'MADE TO BE REMEMBERED' },
        { category: 'Sport', title: 'Sport Collection', eyebrow: 'READY FOR WHAT’S NEXT' },
        { category: 'Minimal', title: 'Minimal Collection', eyebrow: 'LESS, BEAUTIFULLY DONE' },
      ].map((collection) => (
        <HomeProductSection
          key={collection.category}
          eyebrow={collection.eyebrow}
          title={collection.title}
          products={watchProducts.filter((product) => product.category === collection.category).slice(0, 4)}
          onDetails={onDetails}
          onAdd={onAdd}
          wishlisted={wishlisted}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
      <HomeProductSection eyebrow="LOVED BY OUR COMMUNITY" title="Best sellers" products={bestSellers} onDetails={onDetails} onAdd={onAdd} wishlisted={wishlisted} onToggleWishlist={onToggleWishlist} />
      <section className="watch-brand-section">
        <div className="watch-section-title"><div><p className="watch-eyebrow">INDEPENDENT BY NATURE</p><h2>Meet the makers</h2></div></div>
        <div className="watch-brand-grid">
          {brands.map((brand) => (
            <a href="#/products" className="watch-brand-tile" style={{ '--brand-accent': watchProducts.find((product) => product.brand === brand).accent }} key={brand} aria-label={`Explore ${brand} watches`}>
              <span>{brand.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</span>
              <strong>{brand}</strong>
              <small>VIEW TIMEPIECES ↗</small>
            </a>
          ))}
        </div>
      </section>
      <section className="watch-about-band" id="about">
        <p className="watch-eyebrow">OUR POINT OF VIEW</p>
        <h2>Time is personal.</h2>
        <p>Maison Noir brings together independent makers and thoughtful design. We believe the best watch is the one that feels like it has always belonged to you.</p>
        <a href="#/products" className="watch-primary-link">FIND YOUR WATCH <span>↗</span></a>
      </section>
    </main>
  )
}

function WatchCatalog({ onDetails, onAdd, wishlisted, onToggleWishlist, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [brand, setBrand] = useState('All')
  const [category, setCategory] = useState('All')
  const [style, setStyle] = useState('All')
  const [color, setColor] = useState('All')
  const [dialColor, setDialColor] = useState('All')
  const [strap, setStrap] = useState('All')
  const [priceRange, setPriceRange] = useState('All')
  const [rating, setRating] = useState('All')
  const [sort, setSort] = useState('featured')
  const [gender, setGender] = useState('all')

  const shownProducts = useMemo(() => {
    const search = query.trim().toLowerCase()
    const searchTerms = search.split(/\s+/).filter((term) => !['show', 'find', 'me', 'some', 'the', 'a', 'an', 'watches', 'watch', 'please'].includes(term))
    const range = priceRanges.find((item) => item.label === priceRange)
    const result = watchProducts.filter((product) => {
      const searchable = [
        product.name, product.brand, product.model, product.category, product.color,
        product.strapColor, product.strapMaterial, product.dialColor, product.caseColor,
        product.style, product.description,
      ].join(' ').toLowerCase()
      return (!search || searchTerms.every((term) => searchable.includes(term)))
        && (brand === 'All' || product.brand === brand)
        && (category === 'All' || product.category === category)
        && (style === 'All' || product.style === style)
        && (color === 'All' || product.color === color || product.dialColor === color || product.strapColor === color || product.caseColor === color)
        && (dialColor === 'All' || product.dialColor === dialColor)
        && (strap === 'All' || product.strapMaterial === strap)
        && (!range || (product.price >= range.min && product.price <= range.max))
        && (rating === 'All' || product.rating >= Number(rating))
        && (gender === 'all' || product.gender === gender || product.gender === 'unisex')
    })

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    if (sort === 'newest') result.sort((a, b) => b.createdAt - a.createdAt)
    if (sort === 'popular') result.sort((a, b) => b.reviews - a.reviews)
    return result
  }, [query, brand, category, style, color, dialColor, strap, priceRange, rating, sort, gender])

  function clearFilters() {
    setQuery('')
    setBrand('All')
    setCategory('All')
    setStyle('All')
    setColor('All')
    setDialColor('All')
    setStrap('All')
    setPriceRange('All')
    setRating('All')
    setSort('featured')
    setGender('all')
  }

  return (
    <main className="watch-catalog-page">
      <section className="watch-catalog-hero">
        <p className="watch-eyebrow">THE COMPLETE COLLECTION</p>
        <h1>Find your <em>timepiece.</em></h1>
        <p>Distinctive watches, selected for the way you live.</p>
      </section>
      <section className="watch-catalog-content">
        <div className="watch-filter-panel">
          <label className="watch-search-field">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, brand, color, strap…" aria-label="Search watches" />
          </label>
          <label><span>Brand</span><select value={brand} onChange={(event) => setBrand(event.target.value)}><option>All</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Style</span><select value={style} onChange={(event) => setStyle(event.target.value)}><option>All</option>{styles.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Color</span><select value={color} onChange={(event) => setColor(event.target.value)}><option>All</option>{colors.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Dial color</span><select value={dialColor} onChange={(event) => setDialColor(event.target.value)}><option>All</option>{dialColors.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Strap</span><select value={strap} onChange={(event) => setStrap(event.target.value)}><option>All</option>{strapMaterials.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Price</span><select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}><option>All</option>{priceRanges.map((item) => <option key={item.label}>{item.label}</option>)}</select></label>
          <label><span>Rating</span><select value={rating} onChange={(event) => setRating(event.target.value)}><option>All</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option><option value="4.8">4.8+ stars</option></select></label>
          <label><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Highest Rated</option><option value="popular">Most Popular</option></select></label>
          <label><span>Collection</span><select value={gender} onChange={(event) => setGender(event.target.value)}><option value="all">All watches</option><option value="men">Men's</option><option value="women">Women's</option></select></label>
          <button type="button" onClick={clearFilters}>Clear filters</button>
        </div>
        <div className="watch-results-heading"><span>{shownProducts.length} timepieces</span><span>Complimentary insured shipping</span></div>
        {shownProducts.length ? (
          <div className="watch-product-grid watch-catalog-grid">
            {shownProducts.map((product) => (
              <WatchProductCard
                key={product.id}
                product={product}
                onDetails={onDetails}
                onAdd={onAdd}
                isWishlisted={wishlisted.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : <div className="watch-empty-results"><h2>No watches match those filters.</h2><p>Try changing your search or clearing the filters.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
      </section>
    </main>
  )
}

function WatchDetails({ product, onAdd, onBuyNow, wishlisted, wishlistedIds, onToggleWishlist, onDetails }) {
  const [imageIndex, setImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  return (
    <main className="watch-details-page">
      <a className="watch-back-link" href="#/products">← BACK TO WATCHES</a>
      <section className="watch-details-layout">
        <div className="watch-gallery">
          <div className="watch-gallery-main"><img src={product.images[imageIndex]} alt={`${product.name} product view ${imageIndex + 1}`} /></div>
          <div className="watch-gallery-thumbs">
            {product.images.map((image, index) => (
              <button type="button" className={imageIndex === index ? 'selected' : ''} onClick={() => setImageIndex(index)} key={image} aria-label={`Show product image ${index + 1}`}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="watch-details-copy">
          <p className="watch-eyebrow">{product.brand.toUpperCase()} · {product.model}</p>
          <h1>{product.name}</h1>
          <p className="watch-detail-rating">★ {product.rating.toFixed(1)} <span>({product.reviewCount} reviews)</span></p>
          <div className="watch-detail-price"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.originalPrice)}</del><span>{product.discount}% OFF</span></div>
          <p className="watch-detail-description">{product.description}</p>
          <div className="watch-spec-grid">
            <div><span>Category</span><b>{product.category} watch</b></div>
            <div><span>Color</span><b><i className={`color-dot color-${product.color.toLowerCase().replace(/\s+/g, '-')}`} />{product.color}</b></div>
            <div><span>Dial color</span><b>{product.dialColor}</b></div>
            <div><span>Case color</span><b>{product.caseColor}</b></div>
            <div><span>Case shape</span><b>{product.caseShape}</b></div>
            <div><span>Dial style</span><b>{product.dialStyle}</b></div>
            <div><span>Strap</span><b>{product.strapMaterial}</b></div>
            <div><span>Strap color</span><b>{product.strapColor}</b></div>
            <div><span>Style</span><b>{product.style}</b></div>
            <div><span>Model</span><b>{product.model}</b></div>
          </div>
          <p className={`watch-detail-stock ${product.stock <= 5 ? 'low-stock' : ''}`}>{product.stock > 0 ? `${product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}` : 'Out of stock'}</p>
          <div className="watch-detail-actions">
            <div className="watch-quantity">
              <button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <span>{quantity}</span>
              <button type="button" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}>+</button>
            </div>
            <button type="button" className="watch-gold-button" disabled={!product.stock} onClick={() => onAdd(product, quantity)}>ADD TO CART</button>
          </div>
          <button type="button" className="watch-buy-now" disabled={!product.stock} onClick={() => onBuyNow(product, quantity)}>BUY NOW</button>
          <button type="button" className={`watch-wishlist-detail ${wishlisted ? 'is-wishlisted' : ''}`} onClick={() => onToggleWishlist(product.id)}>
            {wishlisted ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
          </button>
        </div>
      </section>
      <section className="watch-related"><div className="watch-section-title"><div><p className="watch-eyebrow">MORE TO ADMIRE</p><h2>Related timepieces</h2></div><a href="#/products">ALL WATCHES ↗</a></div>
        <div className="watch-product-grid watch-related-grid">
          {watchProducts.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4).map((item) => (
            <WatchProductCard key={item.id} product={item} onDetails={onDetails} onAdd={onAdd} isWishlisted={wishlistedIds.includes(item.id)} onToggleWishlist={onToggleWishlist} />
          ))}
        </div>
      </section>
    </main>
  )
}

function WatchCart({ cart, onQuantity, onRemove }) {
  const rows = cart.map((item) => ({ ...item, product: watchProducts.find((product) => product.id === item.id) })).filter((item) => item.product)
  const subtotal = rows.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal >= 10000 || subtotal === 0 ? 0 : 399

  if (!rows.length) {
    return <main className="watch-empty-cart"><p className="watch-eyebrow">YOUR SELECTION</p><h1>Your cart is empty</h1><p>Explore the collection and find a watch to make your own.</p><a className="watch-primary-link" href="#/products">SHOP WATCHES <span>↗</span></a></main>
  }

  return (
    <main className="watch-cart-page">
      <p className="watch-eyebrow">YOUR SELECTION</p><h1>Shopping cart</h1>
      <div className="watch-cart-layout">
        <div className="watch-cart-lines">
          {rows.map(({ product, quantity }) => (
            <article className="watch-cart-row" key={product.id}>
              <a href={`#/product/${product.id}`}><img src={product.image} alt={product.name} /></a>
              <div className="watch-cart-description"><span>{product.brand}</span><h2>{product.name}</h2><p>{product.color} · {product.strapMaterial}</p><button type="button" onClick={() => onRemove(product.id)}>Remove</button></div>
              <div className="watch-cart-end"><strong>{formatPrice(product.price * quantity)}</strong><div className="watch-quantity"><button type="button" disabled={quantity <= 1} onClick={() => onQuantity(product.id, quantity - 1)}>−</button><span>{quantity}</span><button type="button" disabled={quantity >= product.stock} onClick={() => onQuantity(product.id, quantity + 1)}>+</button></div></div>
            </article>
          ))}
          <a className="watch-back-link" href="#/products">← CONTINUE SHOPPING</a>
        </div>
        <aside className="watch-order-summary"><p className="watch-eyebrow">ORDER SUMMARY</p><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Shipping</span><b>{shipping ? formatPrice(shipping) : 'Complimentary'}</b></div><div className="summary-grand-total"><span>Total</span><b>{formatPrice(subtotal + shipping)}</b></div><p>Taxes included where applicable.</p><button type="button" className="watch-gold-button" onClick={() => window.alert('Checkout is not configured in this project yet.')}>PROCEED TO CHECKOUT</button></aside>
      </div>
    </main>
  )
}

function WatchStorefront({ user, notice, onLogout }) {
  const [route, setRoute] = useState(getRoute)
  const [cart, setCart] = useState(() => readList(CART_KEY, (item) => item && typeof item.id === 'string' && Number.isInteger(item.quantity) && item.quantity > 0 && watchProducts.some((product) => product.id === item.id)))
  const [wishlisted, setWishlisted] = useState(() => readList(WISHLIST_KEY, (id) => typeof id === 'string' && watchProducts.some((product) => product.id === id)))
  const [toast, setToast] = useState(notice)

  useEffect(() => {
    function updateRoute() { setRoute(getRoute()) }
    window.addEventListener('hashchange', updateRoute)
    if (!window.location.hash) window.location.hash = '#/home'
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  useEffect(() => {
    if (!route.anchor) return
    window.setTimeout(() => document.getElementById(route.anchor)?.scrollIntoView({ behavior: 'smooth' }), 0)
  }, [route])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const currentProduct = watchProducts.find((product) => product.id === route.id)

  function saveCart(nextCart, message = '') {
    setCart(nextCart)
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(nextCart))
      setToast(message)
    } catch {
      setToast('Cart could not be saved in this browser.')
    }
  }

  function addToCart(product, amount = 1) {
    const existing = cart.find((item) => item.id === product.id)
    const quantity = existing?.quantity || 0
    if (quantity >= product.stock) {
      setToast(`Only ${product.stock} ${product.stock === 1 ? 'piece is' : 'pieces are'} available.`)
      return
    }
    const nextQuantity = Math.min(product.stock, quantity + amount)
    const nextCart = existing
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: nextQuantity } : item)
      : [...cart, { id: product.id, quantity: nextQuantity }]
    saveCart(nextCart, `${product.name} added to cart.`)
  }

  function updateQuantity(id, quantity) {
    const product = watchProducts.find((item) => item.id === id)
    if (!product) return
    saveCart(cart.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(product.stock, quantity)) } : item))
  }

  function removeFromCart(id) {
    saveCart(cart.filter((item) => item.id !== id), 'Watch removed from cart.')
  }

  function toggleWishlist(id) {
    const next = wishlisted.includes(id) ? wishlisted.filter((item) => item !== id) : [...wishlisted, id]
    setWishlisted(next)
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      setToast(next.includes(id) ? 'Added to your wishlist.' : 'Removed from your wishlist.')
    } catch {
      setToast('Wishlist could not be saved in this browser.')
    }
  }

  function showDetails(id) {
    setToast('')
    window.location.hash = `#/product/${id}`
  }

  function buyNow(product, quantity) {
    const existing = cart.find((item) => item.id === product.id)
    const newQuantity = Math.min(product.stock, (existing?.quantity || 0) + quantity)
    const next = existing
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: newQuantity } : item)
      : [...cart, { id: product.id, quantity: newQuantity }]
    saveCart(next)
    window.location.hash = '#/cart'
  }

  let content
  if (route.page === 'products' || route.page === 'watches') {
    content = <WatchCatalog onDetails={showDetails} onAdd={addToCart} wishlisted={wishlisted} onToggleWishlist={toggleWishlist} />
  } else if (route.page === 'product' && currentProduct) {
    content = <WatchDetails key={currentProduct.id} product={currentProduct} onAdd={addToCart} onBuyNow={buyNow} wishlisted={wishlisted.includes(currentProduct.id)} wishlistedIds={wishlisted} onToggleWishlist={toggleWishlist} onDetails={showDetails} />
  } else if (route.page === 'cart') {
    content = <WatchCart cart={cart} onQuantity={updateQuantity} onRemove={removeFromCart} />
  } else if (route.page === 'wishlist') {
    content = <main className="watch-catalog-content"><div className="watch-section-title"><div><p className="watch-eyebrow">SAVED FOR LATER</p><h2>Your wishlist</h2></div></div><div className="watch-product-grid watch-catalog-grid">{watchProducts.filter((product) => wishlisted.includes(product.id)).map((product) => <WatchProductCard key={product.id} product={product} onDetails={showDetails} onAdd={addToCart} isWishlisted onToggleWishlist={toggleWishlist} />)}</div>{!wishlisted.length && <p className="watch-empty-results">Your wishlist is empty.</p>}</main>
  } else {
    content = <WatchHome onDetails={showDetails} onAdd={addToCart} wishlisted={wishlisted} onToggleWishlist={toggleWishlist} />
  }

  return (
    <div className="watch-storefront">
      {notice && <p className="watch-toast">{notice}</p>}
      {toast && <p className="watch-toast" role="status">{toast}</p>}
      <StoreNav route={route} user={user} cartCount={cartCount} onLogout={onLogout} />
      {content}
      <footer className="watch-store-footer" id="contact"><div><a className="watch-store-logo" href="#/home"><span>M</span> MAISON <i>NOIR</i></a><p>Time is the only luxury that cannot be replaced.</p></div><div><a href="#/products">Watches</a><a href="#/home#about">Our story</a><a href="mailto:concierge@maisonnoir.example">Contact concierge</a></div><small>© 2026 MAISON NOIR · CRAFTED FOR YOUR TIME</small></footer>
      <WatchAssistant products={watchProducts} onDetails={showDetails} />
    </div>
  )
}

export default WatchStorefront
