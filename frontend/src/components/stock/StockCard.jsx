import { Link } from 'react-router-dom'
import { formatCurrency, formatPercent, formatVolume } from '../../utils/formatters'
import { useCurrencyStore } from '../../store/currencyStore'
import { useCurrencyConversion } from '../../hooks/useCurrency'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StockCard({ stock }) {
  const isPositive = stock.change >= 0
  const { currency } = useCurrencyStore()
  const convertedPrice = useCurrencyConversion(stock.current_price)
  const convertedChange = useCurrencyConversion(stock.change)

  return (
    <Link
      to={`/stock/${stock.symbol}`}
      className={`block p-6 glass-card glass-card-hover rounded-2xl ${
        isPositive 
          ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20' 
          : 'bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{stock.symbol}</h3>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
        </div>
        {isPositive ? (
          <TrendingUp className="h-6 w-6 text-green-400" />
        ) : (
          <TrendingDown className="h-6 w-6 text-red-400" />
        )}
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold">{formatCurrency(convertedPrice, currency)}</div>
        <div className={`flex items-center space-x-2 font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <span>{formatPercent(stock.change_percent)}</span>
          <span>({formatCurrency(convertedChange, currency)})</span>
        </div>
        {stock.volume && (
          <div className="text-sm text-muted-foreground break-words">
            Volume: {formatVolume(stock.volume)}
          </div>
        )}
      </div>
    </Link>
  )
}

