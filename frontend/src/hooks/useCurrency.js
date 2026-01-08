import { useQuery } from '@tanstack/react-query'
import { useCurrencyStore } from '../store/currencyStore'
import { stockService } from '../services/stockService'

export function useCurrencyConversion(amount, fromCurrency = 'USD') {
  const { currency } = useCurrencyStore()
  
  const { data: converted } = useQuery({
    queryKey: ['convert', amount, fromCurrency, currency],
    queryFn: () => stockService.convertCurrency(amount, fromCurrency, currency),
    enabled: currency !== fromCurrency && !!amount && amount > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const displayAmount = currency === fromCurrency 
    ? amount 
    : converted?.converted_amount || amount

  return displayAmount
}

