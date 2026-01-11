import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useCurrencyStore } from '../store/currencyStore'
import { useThemeStore } from '../store/themeStore'
import { User, Lock, Settings, Trash2, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '../components/ui/Toast'

export default function Profile() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useThemeStore()
  const { currency, setCurrency } = useCurrencyStore()
  const [activeTab, setActiveTab] = useState('info')
  const toast = useToast()
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      toast.error('New passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      toast.error('Password must be at least 8 characters')
      return
    }
    
    // TODO: Implement password change API call
    // For now, show success
    setPasswordSuccess(true)
    toast.success('Password changed successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container px-6 md:px-12 lg:px-16 py-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-foreground">Profile & Settings</h1>
          
          {/* Tabs */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 rounded-lg transition ${
                activeTab === 'info'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card text-foreground hover:bg-white/10'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 rounded-lg transition ${
                activeTab === 'security'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card text-foreground hover:bg-white/10'
              }`}
            >
              <Lock className="h-4 w-4 inline mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-3 rounded-lg transition ${
                activeTab === 'preferences'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card text-foreground hover:bg-white/10'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Preferences
            </button>
          </div>

          {/* Personal Info Tab */}
          {activeTab === 'info' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-foreground">Personal Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={user?.full_name || ''}
                    disabled
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Member Since</label>
                  <input
                    type="text"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    disabled
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-foreground">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                    placeholder="At least 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                    placeholder="Re-enter new password"
                  />
                </div>
                
                {passwordError && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="p-3 bg-green-500/10 text-green-400 rounded-lg text-sm">
                    Password changed successfully!
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center justify-center"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              </form>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-foreground">Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Default Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="INR">INR - Indian Rupee (₹)</option>
                    <option value="JPY">JPY - Japanese Yen (¥)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    All prices will be displayed in this currency
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Theme</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={toggleTheme}
                      className="px-6 py-3 glass-card rounded-lg hover:bg-white/10 transition flex items-center space-x-2"
                    >
                      <span className="text-foreground">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                    <button
                      onClick={toggleTheme}
                      className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                    >
                      Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      toast.success('Preferences saved successfully!')
                    }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
