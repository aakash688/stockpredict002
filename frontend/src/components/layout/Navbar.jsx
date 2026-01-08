import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCurrencyStore } from '../../store/currencyStore'
import UserMenu from './UserMenu'
import StockSearch from '../stock/StockSearch'
import { Menu, X, TrendingUp, Bell } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { currency, setCurrency } = useCurrencyStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="glass-card border-b sticky top-0 z-50 backdrop-blur-xl">
      <div className="container px-6 md:px-12 lg:px-16">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StockPredict</span>
          </Link>

          {/* Main Content Area */}
          <div className="hidden md:flex items-center flex-1 justify-between ml-8">
            {isAuthenticated ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                  <Link to="/dashboard" className="hover:text-primary transition">Dashboard</Link>
                  <Link to="/watchlist" className="hover:text-primary transition">Watchlist</Link>
                  <Link to="/portfolio" className="hover:text-primary transition">Portfolio</Link>
                  {isAdmin && (
                    <Link to="/admin" className="hover:text-primary transition">Admin</Link>
                  )}
                </div>
                
                {/* Search Bar (Center) */}
                <div className="flex-1 max-w-md mx-6">
                  <StockSearch />
                </div>
                
                {/* Actions (Right) */}
                <div className="flex items-center space-x-3">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">USD $</option>
                    <option value="EUR">EUR €</option>
                    <option value="GBP">GBP £</option>
                    <option value="INR">INR ₹</option>
                    <option value="JPY">JPY ¥</option>
                  </select>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  <UserMenu />
                </div>
              </>
            ) : (
              <>
                {/* Empty space for structure consistency */}
                <div className="flex-1"></div>
                
                {/* Actions (Right) - Login + Sign Up */}
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="hover:text-primary transition font-medium">Login</Link>
                  <Link
                    to="/signup"
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)}>Watchlist</Link>
                  <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                  )}
                  <div className="pt-4 border-t border-white/10">
                    <label className="text-sm mb-2 block">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-white/10"
                    >
                      <option value="USD">USD $</option>
                      <option value="EUR">EUR €</option>
                      <option value="GBP">GBP £</option>
                      <option value="INR">INR ₹</option>
                      <option value="JPY">JPY ¥</option>
                    </select>
                  </div>
                  <UserMenu />
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

