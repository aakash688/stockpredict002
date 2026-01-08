import api from './api'

export const stockService = {
  async searchStocks(query) {
    const response = await api.get('/stocks/search', { params: { q: query } })
    return response.data
  },

  async getStockInfo(symbol) {
    const response = await api.get(`/stocks/${symbol}`)
    return response.data
  },

  async getStockHistory(symbol, period = '1mo') {
    const response = await api.get(`/stocks/${symbol}/history`, {
      params: { period },
    })
    return response.data
  },

  async getStockNews(symbol, limit = 10) {
    const response = await api.get(`/stocks/${symbol}/news`, {
      params: { limit },
    })
    return response.data
  },

  async convertCurrency(amount, fromCurrency, toCurrency) {
    const response = await api.post('/stocks/convert', null, {
      params: { amount, from_currency: fromCurrency, to_currency: toCurrency },
    })
    return response.data
  },
}

