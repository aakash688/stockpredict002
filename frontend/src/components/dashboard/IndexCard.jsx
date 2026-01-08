import { Link } from 'react-router-dom'
import { useCurrencyStore } from '../../store/currencyStore'
import { useCurrencyConversion } from '../../hooks/useCurrency'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function IndexCard({ index, delay = 0 }) {
  const { currency } = useCurrencyStore()
  const indexCurrency = index.currency || 'USD'
  const convertedPrice = useCurrencyConversion(index.current_price || 0, indexCurrency)
  const convertedChange = useCurrencyConversion(index.change || 0, indexCurrency)

  return (
    <Link to={`/stock/${index.symbol}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`p-4 glass-card glass-card-hover rounded-2xl cursor-pointer ${
          index.change_percent >= 0 
            ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' 
            : 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
        }`}
      >
        <h3 className="font-semibold mb-2 text-sm">{index.name}</h3>
        <div className="text-2xl font-bold mb-1">
          {formatCurrency(convertedPrice, currency)}
        </div>
        <div
          className={`text-sm font-semibold flex items-center space-x-1 ${
            index.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {index.change_percent >= 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{formatPercent(index.change_percent)}</span>
          <span className="text-xs text-muted-foreground ml-1">
            ({formatCurrency(convertedChange, currency)})
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

