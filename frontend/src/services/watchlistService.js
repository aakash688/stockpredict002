import api from './api'

export const watchlistService = {
  async getWatchlist() {
    const response = await api.get('/watchlist')
    return response.data
  },

  async addToWatchlist(symbol, notes = null) {
    const response = await api.post('/watchlist', {
      stock_symbol: symbol,
      notes,
    })
    return response.data
  },

  async removeFromWatchlist(itemId) {
    await api.delete(`/watchlist/${itemId}`)
  },
}

