import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/adminService'
import { Loader2, Users, BarChart3, Shield } from 'lucide-react'

export default function Admin() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('users')

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminService.getUsers(),
  })

  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getStats(),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }) => adminService.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
    },
  })

  const handleStatusUpdate = (userId, isActive, isAdmin) => {
    updateStatusMutation.mutate({
      userId,
      status: { is_active: isActive, is_admin: isAdmin },
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-6 md:px-12 lg:px-16 py-section">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-primary' : ''}`}
          >
            <Users className="h-5 w-5 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-2 px-4 ${activeTab === 'stats' ? 'border-b-2 border-primary' : ''}`}
          >
            <BarChart3 className="h-5 w-5 inline mr-2" />
            Statistics
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-card border rounded-lg overflow-hidden">
            {usersLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-3">{user.id}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.full_name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            user.is_active
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.is_admin && (
                          <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            handleStatusUpdate(user.id, !user.is_active, user.is_admin)
                          }
                          className="text-sm text-primary hover:underline"
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-3xl font-bold">{stats?.total_users || 0}</div>
            </div>
            <div className="p-6 bg-card border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-3xl font-bold">{stats?.active_users || 0}</div>
            </div>
            <div className="p-6 bg-card border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div className="text-sm text-muted-foreground">Watchlists</div>
              </div>
              <div className="text-3xl font-bold">{stats?.total_watchlists || 0}</div>
            </div>
            <div className="p-6 bg-card border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div className="text-sm text-muted-foreground">Portfolios</div>
              </div>
              <div className="text-3xl font-bold">{stats?.total_portfolios || 0}</div>
            </div>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

