import { Link } from 'react-router-dom'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { useCurrencyStore } from '../../store/currencyStore'
import { useCurrencyConversion } from '../../hooks/useCurrency'
import { TrendingUp, TrendingDown, X } from 'lucide-react'
import { useRemoveFromWatchlist } from '../../hooks/useWatchlist'

export default function WatchlistItem({ item }) {
  const removeMutation = useRemoveFromWatchlist()
  const isPositive = item.change_percent >= 0
  const { currency } = useCurrencyStore()
  const convertedPrice = useCurrencyConversion(item.current_price)
  const convertedChange = useCurrencyConversion(item.change || 0)

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Remove from watchlist?')) {
      removeMutation.mutate(item.id)
    }
  }

  return (
    <Link
      to={`/stock/${item.stock_symbol}`}
      className={`block p-4 glass-card glass-card-hover rounded-2xl group ${
        isPositive 
          ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5' 
          : 'bg-gradient-to-br from-red-500/5 to-orange-500/5'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-bold text-lg">{item.stock_symbol}</h3>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          {item.current_price !== null && (
            <div className="space-y-1">
              <div className="text-xl font-semibold">{formatCurrency(convertedPrice, currency)}</div>
              <div className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(item.change_percent)} ({formatCurrency(convertedChange, currency)})
              </div>
            </div>
          )}
          {item.notes && (
            <p className="text-sm text-muted-foreground mt-2">{item.notes}</p>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 text-destructive rounded transition"
          aria-label="Remove from watchlist"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </Link>
  )
}

