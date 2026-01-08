import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StockSearch from '../components/stock/StockSearch'
import StockCard from '../components/stock/StockCard'
import IndexCard from '../components/dashboard/IndexCard'
import PortfolioValueCard from '../components/dashboard/PortfolioValueCard'
import ProfitLossCard from '../components/dashboard/ProfitLossCard'
import { MoverCard, VolumeCard } from '../components/dashboard/MoverCard'
import { useWatchlist } from '../hooks/useWatchlist'
import { useAuth } from '../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { stockService } from '../services/stockService'
import { portfolioService } from '../services/portfolioService'
import { MAJOR_INDICES, POPULAR_US_STOCKS, POPULAR_INDIAN_STOCKS } from '../utils/constants'
import { Loader2, Eye, Globe, Wallet, BarChart3, TrendingUp, TrendingDown, Volume2, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { user } = useAuth()
  const watchlistQuery = useWatchlist()
  const watchlist = watchlistQuery?.data || []

  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => portfolioService.getPortfolio(),
  })

  const { data: indices, isLoading: indicesLoading } = useQuery({
    queryKey: ['indices'],
    queryFn: async () => {
      const results = await Promise.all(
        MAJOR_INDICES.map(async (index) => {
          try {
            const info = await stockService.getStockInfo(index.symbol)
            return { ...index, ...info }
          } catch (error) {
            if (!import.meta.env.PROD) {
              console.error(`Error fetching ${index.symbol}:`, error)
            }
            return null
          }
        })
      )
      return results.filter(Boolean)
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Fetch popular stocks for top movers
  const { data: popularStocks, isLoading: popularLoading } = useQuery({
    queryKey: ['popularStocks'],
    queryFn: async () => {
      const allStocks = [...POPULAR_US_STOCKS, ...POPULAR_INDIAN_STOCKS]
      const results = await Promise.all(
        allStocks.map(async (symbol) => {
          try {
            const info = await stockService.getStockInfo(symbol)
            return { symbol, ...info }
          } catch {
            return null
          }
        })
      )
      return results.filter(Boolean)
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Calculate top movers - Global (US)
  const usStocks = popularStocks?.filter((s) => !s.symbol.includes('.NS') && !s.symbol.includes('.BO')) || []
  const topGainers = usStocks
    .filter((s) => s.change_percent > 0)
    .sort((a, b) => b.change_percent - a.change_percent)
    .slice(0, 5)

  const topLosers = usStocks
    .filter((s) => s.change_percent < 0)
    .sort((a, b) => a.change_percent - b.change_percent)
    .slice(0, 5)

  const highVolume = usStocks
    .filter((s) => s.volume)
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, 5)

  // Indian stocks
  const indianStocks = popularStocks?.filter((s) => s.symbol.includes('.NS') || s.symbol.includes('.BO')) || []
  const indianTopGainers = indianStocks
    .filter((s) => s.change_percent > 0)
    .sort((a, b) => b.change_percent - a.change_percent)
    .slice(0, 5)

  const indianTopLosers = indianStocks
    .filter((s) => s.change_percent < 0)
    .sort((a, b) => a.change_percent - b.change_percent)
    .slice(0, 5)

  const indianHighVolume = indianStocks
    .filter((s) => s.volume)
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, 5)

  // Calculate portfolio stats
  const totalValue = portfolio?.reduce((sum, item) => sum + (item.current_value || 0), 0) || 0
  const totalCost = portfolio?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0
  const totalPL = totalValue - totalCost
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0
  const isPLPositive = totalPL >= 0

  // Group indices by country
  const groupedIndices = indices?.reduce((acc, index) => {
    const country = index.country || 'US'
    if (!acc[country]) {
      acc[country] = []
    }
    acc[country].push(index)
    return acc
  }, {}) || {}

  const countryNames = {
    'US': 'United States',
    'IN': 'India',
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container px-6 md:px-12 lg:px-16 py-section">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Trader'}! 👋
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your investments today</p>
        </motion.div>

        {/* Portfolio Summary Cards */}
        {portfolio && portfolio.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-card-gap mb-8"
          >
            <PortfolioValueCard totalValue={totalValue} totalCost={totalCost} />

            <ProfitLossCard totalPL={totalPL} totalPLPercent={totalPLPercent} isPLPositive={isPLPositive} />

            <div className="p-6 glass-card rounded-2xl">
              <div className="flex items-center space-x-3 mb-2">
                <Eye className="h-5 w-5 text-primary" />
                <div className="text-sm text-muted-foreground">Watchlist Items</div>
              </div>
              <div className="text-3xl font-bold">{watchlist?.data?.length || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Stocks tracked
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <StockSearch />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-section">
          {/* Market Overview */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Market Overview</h2>
              <div className="text-sm text-muted-foreground px-3 py-1 bg-green-500/10 rounded-full flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Live</span>
              </div>
            </div>
            
            {indicesLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : Object.keys(groupedIndices).length > 0 ? (
              /* Grouped by Country */
              Object.entries(groupedIndices).map(([countryCode, countryIndices], countryIndex) => (
                <div key={countryCode} className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{countryNames[countryCode] || countryCode}</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {countryIndices.map((index, i) => (
                      <IndexCard 
                        key={index.symbol}
                        index={index}
                        delay={0.4 + countryIndex * 0.2 + i * 0.1}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center glass-card rounded-2xl">
                <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">Unable to load market indices.</p>
                <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/watchlist"
                className="block p-4 glass-card glass-card-hover rounded-2xl text-center font-semibold hover:scale-105 transition-transform"
              >
                <Eye className="h-5 w-5 mx-auto mb-2 text-primary" />
                View Watchlist
              </a>
              <a
                href="/portfolio"
                className="block p-4 glass-card glass-card-hover rounded-2xl text-center font-semibold hover:scale-105 transition-transform"
              >
                <Wallet className="h-5 w-5 mx-auto mb-2 text-primary" />
                View Portfolio
              </a>
              <a
                href="/stock/AAPL"
                className="block p-4 glass-card glass-card-hover rounded-2xl text-center font-semibold hover:scale-105 transition-transform"
              >
                <BarChart3 className="h-5 w-5 mx-auto mb-2 text-primary" />
                Explore Stocks
              </a>
            </div>
          </motion.div>
        </div>

        {/* Global Market Movers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Global Market Movers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Top Gainers */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-semibold">Top Gainers</h3>
              </div>
              {popularLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : topGainers.length > 0 ? (
                <div className="space-y-2">
                  {topGainers.map((stock, i) => (
                    <MoverCard key={stock.symbol} stock={stock} isGainer={true} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground glass-card rounded-xl">
                  No data available
                </div>
              )}
            </div>

            {/* Top Losers */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingDown className="h-5 w-5 text-red-400" />
                <h3 className="text-lg font-semibold">Top Losers</h3>
              </div>
              {popularLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : topLosers.length > 0 ? (
                <div className="space-y-2">
                  {topLosers.map((stock, i) => (
                    <MoverCard key={stock.symbol} stock={stock} isGainer={false} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground glass-card rounded-xl">
                  No data available
                </div>
              )}
            </div>

            {/* High Volume */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Volume2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">High Volume</h3>
              </div>
              {popularLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : highVolume.length > 0 ? (
                <div className="space-y-2">
                  {highVolume.map((stock, i) => (
                    <VolumeCard key={stock.symbol} stock={stock} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground glass-card rounded-xl">
                  No data available
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Indian Market Movers Section */}
        {indianStocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Indian Market Movers</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Indian Top Gainers */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-semibold">Top Gainers 🇮🇳</h3>
                </div>
                {popularLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : indianTopGainers.length > 0 ? (
                  <div className="space-y-2">
                    {indianTopGainers.map((stock, i) => (
                      <MoverCard key={stock.symbol} stock={stock} isGainer={true} isIndian={true} />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground glass-card rounded-xl">
                    No data available
                  </div>
                )}
              </div>

              {/* Indian Top Losers */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingDown className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-semibold">Top Losers 🇮🇳</h3>
                </div>
                {popularLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : indianTopLosers.length > 0 ? (
                  <div className="space-y-2">
                    {indianTopLosers.map((stock, i) => (
                      <MoverCard key={stock.symbol} stock={stock} isGainer={false} isIndian={true} />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground glass-card rounded-xl">
                    No data available
                  </div>
                )}
              </div>

              {/* Indian High Volume */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">High Volume 🇮🇳</h3>
                </div>
                {popularLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : indianHighVolume.length > 0 ? (
                  <div className="space-y-2">
                    {indianHighVolume.map((stock, i) => (
                      <VolumeCard key={stock.symbol} stock={stock} isIndian={true} />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground glass-card rounded-xl">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Watchlist Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Watchlist</h2>
            <a href="/watchlist" className="text-primary hover:underline text-sm">
              View All →
            </a>
          </div>
          {watchlistQuery?.isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : watchlist && watchlist.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-card-gap">
              {watchlist.slice(0, 6).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                >
                  <StockCard
                    stock={{
                      symbol: item.stock_symbol,
                      name: item.stock_symbol,
                      current_price: item.current_price || 0,
                      change: item.change || 0,
                      change_percent: item.change_percent || 0,
                      volume: null,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center glass-card rounded-2xl">
              <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">Your watchlist is empty.</p>
              <a href="/watchlist" className="text-primary hover:underline">
                Add stocks to your watchlist →
              </a>
            </div>
          )}
        </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
