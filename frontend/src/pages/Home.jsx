import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StockSearch from '../components/stock/StockSearch'
import { TrendingUp, BarChart3, Target, Shield } from 'lucide-react'
import { Suspense } from 'react'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="container px-6 md:px-12 lg:px-16 py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-foreground">
              Stock Analysis & Prediction Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Make informed investment decisions with AI-powered stock predictions
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              <Suspense fallback={<div className="text-foreground">Loading search...</div>}>
                <StockSearch />
              </Suspense>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-border px-8 py-3 rounded-lg hover:bg-muted transition font-semibold text-foreground"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <div className="glass-card rounded-xl border border-white/10 p-8 min-h-[200px] flex flex-col hover:border-white/20 hover:shadow-2xl transition-all duration-300">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-3 text-foreground">Real-time Data</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get up-to-date stock prices and market information
              </p>
            </div>
            <div className="glass-card rounded-xl border border-white/10 p-8 min-h-[200px] flex flex-col hover:border-white/20 hover:shadow-2xl transition-all duration-300">
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-3 text-foreground">AI Predictions</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Machine learning-powered price predictions for informed decisions
              </p>
            </div>
            <div className="glass-card rounded-xl border border-white/10 p-8 min-h-[200px] flex flex-col hover:border-white/20 hover:shadow-2xl transition-all duration-300">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-3 text-foreground">Portfolio Tracking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Monitor your investments and track profit/loss in real-time
              </p>
            </div>
            <div className="glass-card rounded-xl border border-white/10 p-8 min-h-[200px] flex flex-col hover:border-white/20 hover:shadow-2xl transition-all duration-300">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-3 text-foreground">Watchlist</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Keep track of stocks you're interested in
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

