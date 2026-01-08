import api from './api'

export const predictionService = {
  async getPredictions(symbol, days = 30) {
    const response = await api.get(`/predictions/${symbol}`, {
      params: { days },
    })
    return response.data
  },

  async getPredictionAccuracy(symbol) {
    const response = await api.get(`/predictions/${symbol}/accuracy`)
    return response.data
  },
}

