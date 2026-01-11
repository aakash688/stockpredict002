import { Link } from 'react-router-dom'
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters'
import { useCurrencyStore } from '../../store/currencyStore'
import { useCurrencyConversion } from '../../hooks/useCurrency'
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react'

export default function PortfolioCard({ item, onDelete }) {
  const isPositive = (item.profit_loss || 0) >= 0
  const { currency } = useCurrencyStore()
  
  // Convert all monetary values to selected currency
  const convertedPurchasePrice = useCurrencyConversion(item.purchase_price)
  const convertedCurrentPrice = useCurrencyConversion(item.current_price || 0)
  const convertedCurrentValue = useCurrencyConversion(item.current_value || 0)
  const convertedTotalCost = useCurrencyConversion(item.total_cost || 0)
  const convertedProfitLoss = useCurrencyConversion(item.profit_loss || 0)

  return (
    <div className={`p-5 glass-card glass-card-hover rounded-2xl border transition-all duration-300 ${
      isPositive 
        ? 'border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5 hover:border-green-500/40' 
        : 'border-red-500/20 bg-gradient-to-br from-red-500/5 to-orange-500/5 hover:border-red-500/40'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link 
            to={`/stock/${item.stock_symbol}`} 
            className="font-bold text-lg hover:text-primary transition-colors"
          >
            {item.stock_symbol}
          </Link>
          {item.stock_name && (
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {item.stock_name}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isPositive ? (
            <div className="p-1.5 rounded-full bg-green-500/10">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          ) : (
            <div className="p-1.5 rounded-full bg-red-500/10">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 hover:bg-destructive/10 text-destructive rounded-full transition"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Holdings Info */}
      <div className="mb-4 p-3 bg-card/50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Holdings</span>
          <span className="font-medium text-foreground">
            {item.quantity} shares @ {formatCurrency(convertedPurchasePrice, currency)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Purchased: {formatDate(item.purchase_date)}
        </div>
      </div>

      {/* Current Value Section */}
      {item.current_price !== null && item.current_price !== undefined && (
        <div className="space-y-3 pt-3 border-t border-white/10">
          {/* Current Price */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span className="font-medium text-foreground">
              {formatCurrency(convertedCurrentPrice, currency)}
            </span>
          </div>

          {/* Total Cost */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Cost</span>
            <span className="text-foreground">
              {formatCurrency(convertedTotalCost, currency)}
            </span>
          </div>

          {/* Current Value */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Value</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(convertedCurrentValue, currency)}
            </span>
          </div>

          {/* Profit/Loss */}
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <span className="text-sm text-muted-foreground">Profit/Loss</span>
            <div className={`flex items-center space-x-1 font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <span>
                {isPositive ? '+' : ''}{formatCurrency(convertedProfitLoss, currency)}
              </span>
              <span className="text-xs opacity-80">
                ({isPositive ? '+' : ''}{formatPercent(item.profit_loss_percent)})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading state for price data */}
      {(item.current_price === null || item.current_price === undefined) && (
        <div className="pt-3 border-t border-white/10">
          <div className="text-sm text-muted-foreground text-center py-2">
            Loading current price...
          </div>
        </div>
      )}
    </div>
  )
}
