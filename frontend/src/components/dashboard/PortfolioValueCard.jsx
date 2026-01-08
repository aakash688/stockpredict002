import { useCurrencyStore } from '../../store/currencyStore'
import { useCurrencyConversion } from '../../hooks/useCurrency'
import { formatCurrency } from '../../utils/formatters'
import { Wallet } from 'lucide-react'

export default function PortfolioValueCard({ totalValue, totalCost }) {
  const { currency } = useCurrencyStore()
  const convertedValue = useCurrencyConversion(totalValue)
  const convertedCost = useCurrencyConversion(totalCost)

  return (
    <div className="p-6 glass-card rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
      <div className="flex items-center space-x-3 mb-2">
        <Wallet className="h-5 w-5 text-cyan-400" />
        <div className="text-sm text-muted-foreground">Portfolio Value</div>
      </div>
      <div className="text-3xl font-bold">{formatCurrency(convertedValue, currency)}</div>
      <div className="text-xs text-muted-foreground mt-1">
        Cost: {formatCurrency(convertedCost, currency)}
      </div>
    </div>
  )
}

