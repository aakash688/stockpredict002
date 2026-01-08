import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { watchlistService } from '../services/watchlistService'

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: () => watchlistService.getWatchlist(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ symbol, notes }) => watchlistService.addToWatchlist(symbol, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId) => watchlistService.removeFromWatchlist(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}

