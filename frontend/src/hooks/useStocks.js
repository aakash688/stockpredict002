import { useQuery } from '@tanstack/react-query'
import { stockService } from '../services/stockService'

export function useStockSearch(query) {
  return useQuery({
    queryKey: ['stockSearch', query],
    queryFn: () => stockService.searchStocks(query),
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useStockInfo(symbol) {
  return useQuery({
    queryKey: ['stockInfo', symbol],
    queryFn: () => stockService.getStockInfo(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStockHistory(symbol, period = '1mo') {
  return useQuery({
    queryKey: ['stockHistory', symbol, period],
    queryFn: () => stockService.getStockHistory(symbol, period),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStockNews(symbol, limit = 10) {
  return useQuery({
    queryKey: ['stockNews', symbol, limit],
    queryFn: () => stockService.getStockNews(symbol, limit),
    enabled: !!symbol,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

