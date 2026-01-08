import { Link } from 'react-router-dom'
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters'
import { useCurrencyStore } from '../../store/currencyStore'
import { useCurrencyConversion } from '../../hooks/useCurrency'
import { TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react'

export default function PortfolioCard({ item, onEdit, onDelete }) {
  const isPositive = item.profit_loss >= 0
  const { currency } = useCurrencyStore()
  const convertedPurchasePrice = useCurrencyConversion(item.purchase_price)
  const convertedCurrentValue = useCurrencyConversion(item.current_value)
  const convertedTotalCost = useCurrencyConversion(item.total_cost)
  const convertedProfitLoss = useCurrencyConversion(item.profit_loss)

  return (
    <div className={`p-4 glass-card glass-card-hover rounded-2xl ${
      isPositive 
        ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5' 
        : 'bg-gradient-to-br from-red-500/5 to-orange-500/5'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <Link to={`/stock/${item.stock_symbol}`} className="font-bold text-lg hover:text-primary">
            {item.stock_symbol}
          </Link>
          <p className="text-sm text-muted-foreground">
            {item.quantity} shares @ {formatCurrency(convertedPurchasePrice, currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            Purchased: {formatDate(item.purchase_date)}
          </p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-2 hover:bg-muted rounded transition"
              aria-label="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 hover:bg-destructive/10 text-destructive rounded transition"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {item.current_price !== null && (
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Value</span>
            <span className="font-semibold">{formatCurrency(convertedCurrentValue, currency)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Cost</span>
            <span>{formatCurrency(convertedTotalCost, currency)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Profit/Loss</span>
            <div className={`flex items-center space-x-1 font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-semibold">
                {formatCurrency(convertedProfitLoss, currency)} ({formatPercent(item.profit_loss_percent)})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

