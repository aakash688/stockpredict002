import api from './api'

export const portfolioService = {
  async getPortfolio() {
    const response = await api.get('/portfolio')
    return response.data
  },

  async addToPortfolio(data) {
    const response = await api.post('/portfolio', data)
    return response.data
  },

  async updatePortfolio(itemId, data) {
    const response = await api.put(`/portfolio/${itemId}`, data)
    return response.data
  },

  async removeFromPortfolio(itemId) {
    await api.delete(`/portfolio/${itemId}`)
  },
}

