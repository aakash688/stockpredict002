import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStockSearch } from '../../hooks/useStocks'
import { Search, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StockSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const { data: results, isLoading } = useStockSearch(debouncedQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setIsOpen(query.length > 0)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (results) {
      setSelectedIndex(-1)
    }
  }, [results])

  const handleSelect = (symbol) => {
    if (onSelect) {
      onSelect(symbol)
    } else {
      navigate(`/stock/${symbol}`)
    }
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (!results || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex].symbol)
        } else if (results.length > 0) {
          handleSelect(results[0].symbol)
        }
        break
      case 'Escape':
        e.preventDefault()
        setQuery('')
        setIsOpen(false)
        inputRef.current?.blur()
        break
      default:
        break
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(query.length > 0)}
          placeholder="Search stocks (e.g., AAPL, TSLA, MSFT)..."
          className="w-full pl-10 pr-4 py-3 glass-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl max-h-80 overflow-y-auto"
          >
            {results.map((stock, index) => (
              <button
                key={stock.symbol}
                onClick={() => handleSelect(stock.symbol)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full px-4 py-3 text-left transition-colors ${
                  selectedIndex === index
                    ? 'bg-primary/20'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{stock.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {stock.name}
                    </div>
                  </div>
                  {selectedIndex === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-primary text-xs"
                    >
                      ↵
                    </motion.div>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
        {isOpen && query && results && results.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl p-4 text-center text-sm text-muted-foreground"
          >
            No results found for "{query}"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
