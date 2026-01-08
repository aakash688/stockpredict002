import api from './api'

export const adminService = {
  async getUsers(skip = 0, limit = 100) {
    const response = await api.get('/admin/users', {
      params: { skip, limit },
    })
    return response.data
  },

  async getStats() {
    const response = await api.get('/admin/stats')
    return response.data
  },

  async updateUserStatus(userId, status) {
    const response = await api.put(`/admin/users/${userId}/status`, status)
    return response.data
  },
}

