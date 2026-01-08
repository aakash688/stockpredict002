import { useCurrencyStore } from '../../store/currencyStore'
import { useCurrencyConversion } from '../../hooks/useCurrency'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

export default function ProfitLossCard({ totalPL, totalPLPercent, isPLPositive }) {
  const { currency } = useCurrencyStore()
  const convertedPL = useCurrencyConversion(totalPL)

  return (
    <div className={`p-6 glass-card rounded-2xl ${
      isPLPositive 
        ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' 
        : 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
    }`}>
      <div className="flex items-center space-x-3 mb-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <div className="text-sm text-muted-foreground">Total Profit/Loss</div>
      </div>
      <div className={`text-3xl font-bold flex items-center space-x-2 ${
        isPLPositive ? 'text-green-400' : 'text-red-400'
      }`}>
        {isPLPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
        <span>{formatCurrency(convertedPL, currency)}</span>
      </div>
      <div className={`text-xs font-semibold mt-1 ${
        isPLPositive ? 'text-green-400' : 'text-red-400'
      }`}>
        {formatPercent(totalPLPercent)}
      </div>
    </div>
  )
}

