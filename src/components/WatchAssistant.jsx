import { useState } from 'react'
import {
  findMatchingProducts,
  formatPrice,
} from '../data/products.js'

function WatchAssistant({ products, onDetails }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: 'Hi! 👋 I’m your Watch Assistant. Ask me about brand, color, style, strap, or price.',
    },
  ])

  function getAssistantResponse(text) {
    const lower = text.toLowerCase().trim()

    // Greetings
    if (/^(hi|hello|hey|hai|hii|good morning|good afternoon|good evening)$/.test(lower)) {
      return {
        text: 'Hello! 👋 What type of watch are you looking for? You can ask for a color, brand, style, or price range.',
        products: [],
      }
    }

    // Help
    if (
      lower.includes('what can you do') ||
      lower === 'help' ||
      lower.includes('how can you help')
    ) {
      return {
        text: 'I can help you find watches by brand, color, style, strap material, and price. For example: "black watches", "sport watches under 1000", or "leather watches".',
        products: [],
      }
    }

    // Cheapest watch
    if (
      lower.includes('cheapest') ||
      lower.includes('lowest price') ||
      lower.includes('low price') ||
      lower.includes('cheap watch') ||
      lower.includes('cheap watches')
    ) {
      const sorted = [...products].sort((a, b) => a.price - b.price)

      return {
        text: sorted.length
          ? `The lowest-priced watch is ${sorted[0].name} at ${formatPrice(sorted[0].price)}.`
          : 'I could not find any watches.',
        products: sorted.slice(0, 5),
      }
    }

    // Most expensive watch
    if (
      lower.includes('most expensive') ||
      lower.includes('highest price') ||
      lower.includes('expensive watch')
    ) {
      const sorted = [...products].sort((a, b) => b.price - a.price)

      return {
        text: sorted.length
          ? `The highest-priced watch is ${sorted[0].name} at ${formatPrice(sorted[0].price)}.`
          : 'I could not find any watches.',
        products: sorted.slice(0, 5),
      }
    }

    // Show all watches
    if (
      lower === 'show watches' ||
      lower === 'show me watches' ||
      lower === 'all watches' ||
      lower === 'show all watches' ||
      lower === 'watches'
    ) {
      return {
        text: `We currently have ${products.length} watches available.`,
        products: products.slice(0, 5),
      }
    }

    // Search using the existing product matching function
    const results = findMatchingProducts(text, products)

    if (results.length > 0) {
      return {
        text: `I found ${results.length} watch${results.length === 1 ? '' : 'es'} matching your request.`,
        products: results,
      }
    }

    // Extra natural language fallback
    const words = lower.split(/\s+/)

    const filtered = products.filter((product) => {
      const searchable = [
        product.name,
        product.brand,
        product.model,
        product.category,
        product.color,
        product.strapColor,
        product.strapMaterial,
        product.dialColor,
        product.caseColor,
        product.style,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return words.some((word) => {
        if (word.length < 3) return false

        const ignored = [
          'show',
          'find',
          'want',
          'give',
          'some',
          'watch',
          'watches',
          'please',
          'with',
          'for',
          'the',
          'and',
          'me',
        ]

        return !ignored.includes(word) && searchable.includes(word)
      })
    })

    if (filtered.length > 0) {
      return {
        text: `I found ${filtered.length} watch${filtered.length === 1 ? '' : 'es'} that may match your request.`,
        products: filtered,
      }
    }

    return {
      text: 'I could not find a matching watch. Try something like "black watches", "sport watches under 1000", "leather watches", or "watches between 1000 and 1500".',
      products: [],
    }
  }

  function sendMessage(event) {
    event.preventDefault()

    const text = query.trim()

    if (!text) return

    const response = getAssistantResponse(text)

    setMessages((current) => [
      ...current,
      {
        type: 'user',
        text,
      },
      {
        type: 'assistant',
        text: response.text,
        products: response.products,
      },
    ])

    setQuery('')
  }

  return (
    <div className="watch-assistant">
      {open && (
        <section className="assistant-panel" aria-label="Watch Assistant">
          <header className="assistant-header">
            <div>
              <span className="assistant-status-dot" />
              <strong>Watch Assistant</strong>
              <small>Product concierge</small>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`assistant-message message-${message.type}`}
                key={`${index}-${message.text}`}
              >
                <p>{message.text}</p>

                {message.products?.length > 0 && (
                  <div className="assistant-results">
                    {message.products.slice(0, 5).map((product) => (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => {
                          setOpen(false)
                          onDetails(product.id)
                        }}
                      >
                        <img src={product.image} alt={product.name} />

                        <span>
                          <strong>{product.name}</strong>
                          <small>
                            {product.brand} · {formatPrice(product.price)}
                          </small>
                        </span>

                        <i>↗</i>
                      </button>
                    ))}

                    {message.products.length > 5 && (
                      <small className="assistant-more">
                        + {message.products.length - 5} more matches
                      </small>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form className="assistant-input" onSubmit={sendMessage}>
            <input
              aria-label="Ask about watches"
              placeholder="Try “black watches under 1000”"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <button type="submit" aria-label="Send message">
              →
            </button>
          </form>
        </section>
      )}

      <button
        className="assistant-launcher"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={
          open ? 'Close Watch Assistant' : 'Open Watch Assistant'
        }
      >
        {open ? '×' : '✦'}
      </button>
    </div>
  )
}

export default WatchAssistant