import { Link } from 'react-router-dom'
import { useCurrencyStore } from '../../store/currencyStore'
import { useCurrencyConversion } from '../../hooks/useCurrency'
import { formatCurrency, formatPercent, formatVolume } from '../../utils/formatters'

export function MoverCard({ stock, isGainer = false, isIndian = false }) {
  const { currency } = useCurrencyStore()
  const stockCurrency = isIndian ? 'INR' : 'USD'
  const convertedPrice = useCurrencyConversion(stock.current_price || 0, stockCurrency)
  const convertedChange = useCurrencyConversion(stock.change || 0, stockCurrency)

  return (
    <Link
      to={`/stock/${stock.symbol}`}
      className="block p-3 glass-card glass-card-hover rounded-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{stock.symbol}</div>
          <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
        </div>
        <div className="text-right ml-2">
          <div className={`text-sm font-bold ${
            isGainer ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatPercent(stock.change_percent || 0)}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatCurrency(convertedPrice, currency)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function VolumeCard({ stock, isIndian = false }) {
  const { currency } = useCurrencyStore()
  const stockCurrency = isIndian ? 'INR' : 'USD'
  const convertedPrice = useCurrencyConversion(stock.current_price || 0, stockCurrency)

  return (
    <Link
      to={`/stock/${stock.symbol}`}
      className="block p-3 glass-card glass-card-hover rounded-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{stock.symbol}</div>
          <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
        </div>
        <div className="text-right ml-2">
          <div className="text-sm font-bold break-words">
            {formatVolume(stock.volume)}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatCurrency(convertedPrice, currency)}
          </div>
        </div>
      </div>
    </Link>
  )
}

