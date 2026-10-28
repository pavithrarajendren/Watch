const colorHex = {
  Black: '#252a31',
  Silver: '#aeb8c2',
  Gold: '#c4a15b',
  'Rose Gold': '#c88978',
  Blue: '#356c9d',
  Green: '#4d7967',
  Brown: '#80583f',
  White: '#e8e7df',
  Gunmetal: '#59616b',
  Navy: '#253d62',
  Grey: '#858b90',
  Burgundy: '#793d4a',
  Orange: '#d47a46',
  Purple: '#73618d',
  Titanium: '#8b969d',
  Cream: '#e4d8bd',
  Olive: '#647254',
}

const brandAccents = {
  Chronova: '#315b7e',
  Aurelius: '#9a7040',
  Veltrix: '#376e72',
  Nexora: '#4d62a1',
  TimeCraft: '#76533f',
  'Royal Meridian': '#754553',
  UrbanTick: '#4d6672',
  Elvora: '#a16b70',
  CrownTime: '#887144',
  'Veyron Watches': '#505a69',
  Ardent: '#b46443',
  Lunaro: '#74638e',
}

function caseShapeMarkup(shape, fill, stroke) {
  if (shape === 'Square') return `<rect x="91" y="115" width="218" height="218" rx="43" fill="${fill}" stroke="${stroke}" stroke-width="8"/>`
  if (shape === 'Rectangular') return `<rect x="112" y="94" width="176" height="264" rx="38" fill="${fill}" stroke="${stroke}" stroke-width="8"/>`
  if (shape === 'Tonneau') return `<path d="M142 102 Q200 79 258 102 L300 152 L300 296 L258 346 Q200 369 142 346 L100 296 L100 152Z" fill="${fill}" stroke="${stroke}" stroke-width="8"/>`
  if (shape === 'Octagonal') return `<path d="M142 94H258L306 142V308L258 356H142L94 308V142Z" fill="${fill}" stroke="${stroke}" stroke-width="8"/>`
  return `<circle cx="200" cy="225" r="108" fill="${fill}" stroke="${stroke}" stroke-width="8"/>`
}

function dialShapeMarkup(shape, fill, stroke) {
  if (shape === 'Square') return `<rect x="108" y="132" width="184" height="184" rx="34" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
  if (shape === 'Rectangular') return `<rect x="128" y="112" width="144" height="228" rx="29" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
  if (shape === 'Tonneau') return `<path d="M150 123 Q200 103 250 123 L278 160V288L250 327Q200 347 150 327L122 288V160Z" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
  if (shape === 'Octagonal') return `<path d="M149 116H251L284 149V301L251 334H149L116 301V149Z" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
  return `<circle cx="200" cy="225" r="89" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
}

function markerMarkup(product) {
  if (product.dialStyle === 'Digital') {
    return `<rect x="143" y="181" width="114" height="83" rx="10" fill="#121c28" stroke="${product.accent}" stroke-width="3"/><text x="200" y="232" text-anchor="middle" fill="#9ce6da" font-size="32" font-family="monospace">10:08</text><text x="200" y="250" text-anchor="middle" fill="#b9c9d4" font-size="8" font-family="Arial">MON 24 · 72 BPM</text>`
  }
  if (product.dialStyle === 'Skeleton') {
    return `<circle cx="200" cy="225" r="61" fill="none" stroke="${product.accent}" stroke-width="4"/><circle cx="200" cy="225" r="36" fill="none" stroke="${product.accent}" stroke-width="3"/><path d="M200 164v122M139 225h122M157 182l86 86m0-86-86 86" stroke="${product.accent}" stroke-width="2" opacity=".8"/>`
  }
  const positions = [[200, 150], [249, 176], [273, 225], [249, 274], [200, 300], [151, 274], [127, 225], [151, 176]]
  const labels = product.dialStyle === 'Roman'
    ? ['XII', 'II', 'III', 'IV', 'VI', 'VIII', 'IX', 'X']
    : product.dialStyle === 'Arabic'
      ? ['12', '2', '3', '4', '6', '8', '9', '10']
      : null
  const markers = labels
    ? positions.map(([x, y], index) => `<text x="${x}" y="${y + 4}" fill="${product.markerHex}" text-anchor="middle" font-family="Georgia" font-size="${index % 2 === 0 ? 13 : 10}">${labels[index]}</text>`).join('')
    : positions.map(([x, y], index) => `<rect x="${x - (index % 2 ? 2 : 3)}" y="${y - 7}" width="${index % 2 ? 4 : 6}" height="${index % 2 ? 11 : 17}" rx="2" fill="${product.markerHex}" transform="rotate(${index * 45} ${x} ${y})"/>`).join('')

  if (!product.complication) return markers
  return `${markers}<circle cx="165" cy="235" r="18" fill="none" stroke="${product.accent}" stroke-width="2"/><circle cx="235" cy="235" r="18" fill="none" stroke="${product.accent}" stroke-width="2"/><circle cx="200" cy="274" r="15" fill="none" stroke="${product.accent}" stroke-width="2"/><path d="M165 235v-12m70 12v-10m-35 49v-10" stroke="${product.markerHex}" stroke-width="2"/>`
}

function watchImage(product, angle) {
  const { id, caseHex, dialHex, strapHex, caseShape, strapMaterial } = product
  const caseShapeSvg = caseShapeMarkup(caseShape, `url(#case-${id}-${angle})`, product.edgeHex)
  const dialShapeSvg = dialShapeMarkup(caseShape, `url(#dial-${id}-${angle})`, product.markerHex)
  const rotation = [-2, 1, 3, -1][angle % 4]
  const strapTexture = strapMaterial.includes('Steel') || strapMaterial.includes('Titanium') || strapMaterial.includes('Ceramic') || strapMaterial.includes('Mesh')
    ? `<path d="M157 24h86M150 45h100M146 66h108M142 87h116M142 363h116M146 384h108M150 405h100M157 426h86" stroke="#fff" stroke-opacity=".33" stroke-width="3"/>`
    : strapMaterial === 'Leather'
      ? `<path d="M157 28v91m86-91v91m-86 242v82m86-82v82" stroke="#fff" stroke-opacity=".3" stroke-width="2"/><circle cx="200" cy="397" r="4" fill="#f3eee6"/>`
      : strapMaterial === 'Fabric'
        ? `<path d="M151 28l98 86m-106-67 96 84m-104-65 93 81m-83 216 85-82m-66 101 76-73m-55 92 64-61" stroke="#fff" stroke-opacity=".2" stroke-width="3"/>`
        : `<path d="M160 35h80M157 58h86M153 81h94M153 369h94M157 392h86M160 415h80" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>`
  const hands = product.dialStyle === 'Digital'
    ? ''
    : `<path d="M200 224v-48m0 48 34 21" stroke="${product.handHex}" stroke-width="4" stroke-linecap="round"/><path d="M200 224l-22 32" stroke="${product.accent}" stroke-width="2" stroke-linecap="round"/><circle cx="200" cy="224" r="6" fill="${product.accent}"/>`
  const outerRim = product.caseShape === 'Round'
    ? `<circle cx="200" cy="225" r="98" fill="none" stroke="#fff" stroke-opacity=".54" stroke-width="2"/>`
    : `<path d="M124 145h152v160H124z" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`
  const bezel = product.caseShape === 'Octagonal'
    ? `<path d="M151 124H249L276 151V299L249 326H151L124 299V151Z" fill="none" stroke="${product.accent}" stroke-width="2"/>`
    : ''
  const digital = product.dialStyle === 'Digital'
    ? ''
    : `<text x="200" y="204" text-anchor="middle" fill="${product.markerHex}" opacity=".72" font-size="8" font-family="Arial" letter-spacing="2">${product.brand.toUpperCase()}</text>${hands}`
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" role="img">
      <defs>
        <linearGradient id="strap-${id}-${angle}" x1="0" x2="1">
          <stop stop-color="#fff" stop-opacity=".18"/><stop offset=".45" stop-color="${strapHex}"/><stop offset="1" stop-color="#111" stop-opacity=".24"/>
        </linearGradient>
        <linearGradient id="case-${id}-${angle}" x1=".1" y1="0" x2=".95" y2="1">
          <stop stop-color="#fff"/><stop offset=".3" stop-color="${caseHex}"/><stop offset=".7" stop-color="${product.edgeHex}"/><stop offset="1" stop-color="#fff" stop-opacity=".65"/>
        </linearGradient>
        <radialGradient id="dial-${id}-${angle}" cx=".34" cy=".2" r=".92">
          <stop stop-color="${dialHex}"/><stop offset="1" stop-color="${product.dialShade}"/>
        </radialGradient>
        <filter id="shadow-${id}-${angle}" x="-40%" y="-30%" width="180%" height="180%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10"/><feOffset dy="13"/><feComponentTransfer><feFuncA type="linear" slope=".18"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="400" height="480" rx="22" fill="#f6f7f8"/>
      <circle cx="200" cy="221" r="166" fill="${product.accent}" opacity=".045"/>
      <ellipse cx="200" cy="431" rx="100" ry="15" fill="#243343" opacity=".12"/>
      <g filter="url(#shadow-${id}-${angle})" transform="rotate(${rotation} 200 225)">
        <path d="M157 20 Q200 8 243 20 L267 153 H133Z M133 297H267L243 460Q200 472 157 460Z" fill="url(#strap-${id}-${angle})" stroke="${product.edgeHex}" stroke-opacity=".65" stroke-width="2"/>
        ${strapTexture}
        ${caseShapeSvg}
        ${outerRim}
        ${bezel}
        ${dialShapeSvg}
        ${markerMarkup(product)}
        ${digital}
        <rect x="302" y="211" width="17" height="27" rx="5" fill="url(#case-${id}-${angle})" stroke="${product.edgeHex}" stroke-width="2"/>
        <path d="M${angle % 2 === 0 ? '135 123' : '144 131'}l24 8" stroke="#fff" stroke-opacity=".42" stroke-width="3" stroke-linecap="round"/>
      </g>
      <text x="200" y="462" text-anchor="middle" fill="#677482" font-size="9" font-family="Arial" letter-spacing="2">${product.brand.toUpperCase()} · ${product.model}</text>
    </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const productSpecs = [
   { id: 'chronolux-executive-black', brand: 'Chronova', name: 'Meridian Classic', model: 'CH-104', category: 'Classic', style: 'Heritage dress', price: 799, originalPrice: 999, rating: 4.8, reviews: 126, caseColor: 'Silver', dialColor: 'White', strapColor: 'Black', strapMaterial: 'Leather', caseShape: 'Round', dialStyle: 'Roman', color: 'Silver', gender: 'men', stock: 7, description: 'A crisp porcelain-white dial, fine Roman numerals and supple black leather bring quiet confidence to every occasion.', accent: brandAccents.Chronova, complication: false },

  { id: 'prestige-heritage-green', brand: 'Aurelius', name: 'Garden Rose', model: 'AU-28R', category: 'Luxury', style: 'Luxury automatic', price: 1499, originalPrice: 1799, rating: 4.9, reviews: 158, caseColor: 'Rose Gold', dialColor: 'Green', strapColor: 'Brown', strapMaterial: 'Leather', caseShape: 'Round', dialStyle: 'Indices', color: 'Rose Gold', gender: 'women', stock: 4, description: 'A deep botanical green dial set in warm rose gold, finished with a hand-stitched espresso leather strap.', accent: brandAccents.Aurelius, complication: false },

  { id: 'nova-sport-blue', brand: 'Veltrix', name: 'Blue Current', model: 'VX-500', category: 'Diver', style: 'Sport diver', price: 999, originalPrice: 1299, rating: 4.7, reviews: 203, caseColor: 'Black', dialColor: 'Blue', strapColor: 'Black', strapMaterial: 'Rubber', caseShape: 'Round', dialStyle: 'Indices', color: 'Blue', gender: 'men', stock: 11, description: 'A bold, water-ready diver with luminous minute markers, a blue wave dial and a grippy black rubber strap.', accent: brandAccents.Veltrix, complication: false },

  { id: 'urbantime-minimal-silver', brand: 'Nexora', name: 'Arc Minimal', model: 'NX-01', category: 'Minimal', style: 'Minimal modern', price: 899, originalPrice: 1199, rating: 4.6, reviews: 88, caseColor: 'Silver', dialColor: 'Navy', strapColor: 'Silver', strapMaterial: 'Mesh', caseShape: 'Round', dialStyle: 'Indices', color: 'Silver', gender: 'unisex', stock: 13, description: 'A slim profile and restrained markers frame a midnight-blue dial on a feather-light steel mesh bracelet.', accent: brandAccents.Nexora, complication: false },

  { id: 'timecraft-casual-tan', brand: 'TimeCraft', name: 'Field Heritage', model: 'TC-44F', category: 'Field', style: 'Utility field', price: 699, originalPrice: 899, rating: 4.5, reviews: 72, caseColor: 'Gunmetal', dialColor: 'Cream', strapColor: 'Olive', strapMaterial: 'Fabric', caseShape: 'Round', dialStyle: 'Arabic', color: 'Green', gender: 'men', stock: 9, description: 'High-contrast Arabic numerals and an olive canvas strap make this brushed field watch ready for the long way around.', accent: brandAccents.TimeCraft, complication: false },

  { id: 'elitechron-rose-gold', brand: 'Royal Meridian', name: 'Grand Chronograph', model: 'RM-77C', category: 'Chronograph', style: 'Racing chronograph', price: 1799, originalPrice: 1999, rating: 4.9, reviews: 174, caseColor: 'Silver', dialColor: 'Burgundy', strapColor: 'Black', strapMaterial: 'Leather', caseShape: 'Round', dialStyle: 'Indices', color: 'Burgundy', gender: 'men', stock: 5, description: 'Three precision-inspired subdials and a rich burgundy face lend motorsport energy to a polished steel chronograph.', accent: brandAccents['Royal Meridian'], complication: true },

  { id: 'titanedge-fabric-grey', brand: 'UrbanTick', name: 'Square One', model: 'UT-SQ2', category: 'Fashion', style: 'Modern geometric', price: 849, originalPrice: 1099, rating: 4.4, reviews: 61, caseColor: 'Gunmetal', dialColor: 'Grey', strapColor: 'Black', strapMaterial: 'Leather', caseShape: 'Square', dialStyle: 'Indices', color: 'Grey', gender: 'unisex', stock: 12, description: 'A softened square case, smoky grey face and black leather strap create an architectural everyday statement.', accent: brandAccents.UrbanTick, complication: false },

  { id: 'royaltime-formal-white', brand: 'Elvora', name: 'Petite Pearl', model: 'EL-18P', category: 'Elegant', style: 'Women’s elegant', price: 1299, originalPrice: 1599, rating: 4.8, reviews: 97, caseColor: 'Rose Gold', dialColor: 'White', strapColor: 'Rose Gold', strapMaterial: 'Mesh', caseShape: 'Rectangular', dialStyle: 'Roman', color: 'Rose Gold', gender: 'women', stock: 5, description: 'A petite rectangular silhouette with pearl-white Roman dial and a delicate rose-gold mesh bracelet.', accent: brandAccents.Elvora, complication: false },

  { id: 'prestige-skeleton-gold', brand: 'CrownTime', name: 'Skeleton Reserve', model: 'CT-S88', category: 'Skeleton', style: 'Open-work automatic', price: 1899, originalPrice: 1999, rating: 5.0, reviews: 203, caseColor: 'Gold', dialColor: 'Gold', strapColor: 'Brown', strapMaterial: 'Leather', caseShape: 'Round', dialStyle: 'Skeleton', color: 'Gold', gender: 'men', stock: 2, description: 'An open-work dial reveals its mechanical-inspired architecture beneath a golden bezel and hand-finished leather.', accent: brandAccents.CrownTime, complication: false },

  { id: 'titanedge-chronograph-gunmetal', brand: 'Veyron Watches', name: 'Titanium Chrono', model: 'VW-T09', category: 'Chronograph', style: 'Technical chronograph', price: 1699, originalPrice: 1999, rating: 4.7, reviews: 111, caseColor: 'Titanium', dialColor: 'Black', strapColor: 'Grey', strapMaterial: 'Titanium bracelet', caseShape: 'Tonneau', dialStyle: 'Indices', color: 'Titanium', gender: 'men', stock: 4, description: 'A sculpted tonneau case in featherweight titanium surrounds a layered black chronograph dial with crisp red accents.', accent: brandAccents['Veyron Watches'], complication: true },

  { id: 'nova-smart-pulse-black', brand: 'Ardent', name: 'Cinder Digital', model: 'AR-D14', category: 'Smart', style: 'Digital sport', price: 1099, originalPrice: 1399, rating: 4.3, reviews: 244, caseColor: 'Black', dialColor: 'Black', strapColor: 'Orange', strapMaterial: 'Silicone', caseShape: 'Square', dialStyle: 'Digital', color: 'Black', gender: 'unisex', stock: 8, description: 'A legible digital display, rugged square profile and vivid sport strap bring an energetic edge to everyday utility.', accent: brandAccents.Ardent, complication: false },

  { id: 'chronolux-moonphase-navy', brand: 'Lunaro', name: 'Moonline Petite', model: 'LU-M22', category: 'Formal', style: 'Art deco formal', price: 1199, originalPrice: 1499, rating: 4.6, reviews: 66, caseColor: 'Silver', dialColor: 'Navy', strapColor: 'Blue', strapMaterial: 'Leather', caseShape: 'Rectangular', dialStyle: 'Roman', color: 'Navy', gender: 'women', stock: 6, description: 'Art-deco lines, a deep navy face and a slim blue leather strap give this refined rectangle its evening poise.', accent: brandAccents.Lunaro, complication: false },

  { id: 'chronova-coastline-automatic', brand: 'Chronova', name: 'Coastline Automatic', model: 'CH-900A', category: 'Diver', style: 'Premium diver', price: 1599, originalPrice: 1899, rating: 4.9, reviews: 188, caseColor: 'Silver', dialColor: 'Green', strapColor: 'Green', strapMaterial: 'Rubber', caseShape: 'Octagonal', dialStyle: 'Indices', color: 'Green', gender: 'men', stock: 3, description: 'An angular steel diver with a forest-green face and secure rubber strap, built for weekends near the water.', accent: brandAccents.Chronova, complication: false },

  { id: 'royaltime-classic-gold', brand: 'Aurelius', name: 'Champagne Heritage', model: 'AU-1924', category: 'Vintage', style: 'Vintage classic', price: 1099, originalPrice: 1399, rating: 4.7, reviews: 84, caseColor: 'Gold', dialColor: 'Champagne', strapColor: 'Brown', strapMaterial: 'Leather', caseShape: 'Round', dialStyle: 'Roman', color: 'Gold', gender: 'unisex', stock: 7, description: 'A softly aged champagne dial, fine gold-tone bezel and warm brown leather capture the charm of another era.', accent: brandAccents.Aurelius, complication: false },

  { id: 'elitechron-sport-orange', brand: 'Veltrix', name: 'Expedition Orange', model: 'VX-EX4', category: 'Sport', style: 'Adventure sport', price: 949, originalPrice: 1199, rating: 4.5, reviews: 91, caseColor: 'Gunmetal', dialColor: 'Black', strapColor: 'Orange', strapMaterial: 'Fabric', caseShape: 'Octagonal', dialStyle: 'Arabic', color: 'Orange', gender: 'men', stock: 10, description: 'Oversized Arabic numerals, a dark angular case and bright orange fabric keep this expedition watch easy to read.', accent: brandAccents.Veltrix, complication: false },

  { id: 'nexora-lustre-ceramic', brand: 'Nexora', name: 'Lustre Ceramic', model: 'NX-C77', category: 'Luxury', style: 'Modern luxury', price: 1499, originalPrice: 1799, rating: 4.8, reviews: 134, caseColor: 'White', dialColor: 'Purple', strapColor: 'White', strapMaterial: 'Ceramic bracelet', caseShape: 'Round', dialStyle: 'Indices', color: 'White', gender: 'women', stock: 4, description: 'Gloss-white ceramic links set off a luminous violet dial for a clean, contemporary luxury look.', accent: brandAccents.Nexora, complication: false },

  { id: 'timecraft-leather-brown', brand: 'TimeCraft', name: 'Slimline Formal', model: 'TC-S11', category: 'Formal', style: 'Slim dress', price: 899, originalPrice: 1199, rating: 4.6, reviews: 105, caseColor: 'Silver', dialColor: 'White', strapColor: 'Blue', strapMaterial: 'Leather', caseShape: 'Rectangular', dialStyle: 'Indices', color: 'Blue', gender: 'men', stock: 6, description: 'A remarkably slim silver case, bright white dial and midnight-blue leather strap make an easy formal companion.', accent: brandAccents.TimeCraft, complication: false },

  { id: 'royal-meridian-regatta', brand: 'Royal Meridian', name: 'Regatta Timer', model: 'RM-R80', category: 'Sport', style: 'Sport chronograph', price: 1399, originalPrice: 1699, rating: 4.7, reviews: 143, caseColor: 'Black', dialColor: 'Blue', strapColor: 'Black', strapMaterial: 'Rubber', caseShape: 'Tonneau', dialStyle: 'Indices', color: 'Blue', gender: 'unisex', stock: 5, description: 'A blue multi-register face, distinctive tonneau case and textured rubber band bring bold precision to active days.', accent: brandAccents['Royal Meridian'], complication: true },

  { id: 'urbantime-mesh-blue', brand: 'UrbanTick', name: 'Metro Steel', model: 'UT-MB7', category: 'Casual', style: 'Urban minimal', price: 799, originalPrice: 999, rating: 4.4, reviews: 58, caseColor: 'Silver', dialColor: 'Blue', strapColor: 'Silver', strapMaterial: 'Stainless Steel', caseShape: 'Round', dialStyle: 'Indices', color: 'Blue', gender: 'unisex', stock: 10, description: 'A sunlit blue dial, quiet applied markers and a finely articulated steel bracelet offer a fresh take on everyday city style.', accent: brandAccents.UrbanTick, complication: false },

  { id: 'elvora-burgundy-luna', brand: 'Elvora', name: 'Burgundy Luna', model: 'EL-L30', category: 'Elegant', style: 'Women’s premium', price: 1299, originalPrice: 1599, rating: 4.8, reviews: 119, caseColor: 'Rose Gold', dialColor: 'Burgundy', strapColor: 'Burgundy', strapMaterial: 'Leather', caseShape: 'Tonneau', dialStyle: 'Roman', color: 'Burgundy', gender: 'women', stock: 5, description: 'A softly curved rose-gold case frames a wine-red Roman dial on a matching burgundy leather strap.', accent: brandAccents.Elvora, complication: false },

  { id: 'crowntime-field-olive', brand: 'CrownTime', name: 'Fieldwatch Olive', model: 'CT-F06', category: 'Field', style: 'Vintage field', price: 749, originalPrice: 999, rating: 4.5, reviews: 77, caseColor: 'Silver', dialColor: 'Green', strapColor: 'Olive', strapMaterial: 'Fabric', caseShape: 'Round', dialStyle: 'Arabic', color: 'Green', gender: 'unisex', stock: 12, description: 'A brushed steel field case and legible green Arabic dial pair with a rugged olive woven strap.', accent: brandAccents.CrownTime, complication: false },
]

export const watchProducts = productSpecs.map((product, index) => {
  const caseHex = colorHex[product.caseColor] ?? colorHex.Silver
  const dialHex = colorHex[product.dialColor] ?? colorHex.Black
  const strapHex = colorHex[product.strapColor] ?? colorHex.Black
  const accent = product.accent
  const enriched = {
    ...product,
    discount: Math.round((1 - product.price / product.originalPrice) * 100),
    reviewCount: product.reviews,
    createdAt: 1700000000000 + index * 86400000,
    caseHex,
    dialHex,
    strapHex,
    accent,
    edgeHex: product.caseColor === 'Gold' || product.caseColor === 'Rose Gold' ? '#805e3b' : '#687380',
    markerHex: product.dialColor === 'White' || product.dialColor === 'Cream' || product.dialColor === 'Champagne' ? '#39434d' : '#f7f3e8',
    handHex: product.dialColor === 'White' || product.dialColor === 'Cream' || product.dialColor === 'Champagne' ? '#283747' : '#fbf8ef',
    dialShade: product.dialColor === 'White' || product.dialColor === 'Cream' ? '#c9c7bc' : '#16212b',
  }
  const images = [0, 1, 2, 3].map((angle) => watchImage(enriched, angle))
  return { ...enriched, image: images[0], images }
})

export const brands = [...new Set(watchProducts.map((product) => product.brand))]
export const categories = [...new Set(watchProducts.map((product) => product.category))]
export const styles = [...new Set(watchProducts.map((product) => product.style))]
export const colors = [...new Set(watchProducts.map((product) => product.color))]
export const dialColors = [...new Set(watchProducts.map((product) => product.dialColor))]
export const strapMaterials = [...new Set(watchProducts.map((product) => product.strapMaterial))]
export const priceRanges = [
  { label: 'Under ₹5,000', min: 0, max: 4999 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
  { label: 'Above ₹20,000', min: 20001, max: Infinity },
]

export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

export function findMatchingProducts(query, sourceProducts = watchProducts) {
  const text = query.toLowerCase()
  const underMatch = text.match(/(?:under|below|less than)\s*₹?\s*(5000|5,000|5k|10000|10,000|10k)/)
  const betweenMatch = text.match(/between\s*₹?\s*(5000|5,000|5k|10000|10,000|10k)\s*(?:and|to|-)\s*₹?\s*(5000|5,000|5k|10000|10,000|10k)/)
  const parseAmount = (value) => Number(value.replace(/[₹,]/g, '').replace(/k/i, '000'))
  const ignoredTerms = new Set(['show', 'find', 'me', 'some', 'the', 'a', 'an', 'watches', 'watch', 'please', 'under', 'below', 'between', 'and', 'to', 'less', 'than', '₹', 'rs'])
  const terms = text.split(/\s+/).filter((term) => term && !ignoredTerms.has(term))
  let matches = sourceProducts.filter((product) => {
    const searchable = [
      product.name, product.brand, product.model, product.category, product.color,
      product.strapColor, product.strapMaterial, product.dialColor, product.caseColor, product.style,
    ].join(' ').toLowerCase()
    return terms.length === 0 || terms.every((term) => searchable.includes(term))
  })

  if (underMatch) {
    const amount = parseAmount(underMatch[1])
    matches = sourceProducts.filter((product) => product.price < amount)
  }
  if (betweenMatch) {
    const min = parseAmount(betweenMatch[1])
    const max = parseAmount(betweenMatch[2])
    matches = sourceProducts.filter((product) => product.price >= min && product.price <= max)
  }
  return matches
}
