import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PortfolioCard from '../components/portfolio/PortfolioCard'
import StockSearch from '../components/stock/StockSearch'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { portfolioService } from '../services/portfolioService'
import { formatCurrency } from '../utils/formatters'
import { Loader2, Plus, TrendingUp, TrendingDown, X, Calendar, Hash, DollarSign } from 'lucide-react'
import { useToast } from '../components/ui/Toast'
import { useCurrencyStore } from '../store/currencyStore'
import { useCurrencyConversion } from '../hooks/useCurrency'
import { motion, AnimatePresence } from 'framer-motion'

// Helper component to show estimated cost with currency conversion
function EstimatedCostPreview({ quantity, price, currency }) {
  const totalUSD = quantity * price
  const convertedTotal = useCurrencyConversion(totalUSD)
  
  return (
    <div className="p-4 bg-card/50 rounded-lg border border-border">
      <div className="text-sm text-muted-foreground mb-1">Estimated Total Cost</div>
      <div className="text-xl font-bold text-foreground">
        {formatCurrency(convertedTotal, currency)}
      </div>
      {currency !== 'USD' && (
        <div className="text-xs text-muted-foreground mt-1">
          (${totalUSD.toFixed(2)} USD)
        </div>
      )}
    </div>
  )
}

export default function Portfolio() {
  const queryClient = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const toast = useToast()
  const { currency } = useCurrencyStore()
  
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => portfolioService.getPortfolio(),
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId) => portfolioService.removeFromPortfolio(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      toast.success('Position removed successfully')
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to remove position'
      toast.error(message)
    },
  })

  const addMutation = useMutation({
    mutationFn: (data) => portfolioService.addToPortfolio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      resetForm()
      toast.success('Position added to portfolio!')
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to add position. Please check the stock symbol.'
      toast.error(message)
    },
  })

  // Calculate totals with currency conversion
  const totalCost = portfolio?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0
  const totalValue = portfolio?.reduce((sum, item) => sum + (item.current_value || 0), 0) || 0
  const totalPL = totalValue - totalCost
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0
  
  // Convert totals to selected currency
  const convertedTotalCost = useCurrencyConversion(totalCost)
  const convertedTotalValue = useCurrencyConversion(totalValue)
  const convertedTotalPL = useCurrencyConversion(totalPL)

  const resetForm = () => {
    setShowAddForm(false)
    setSelectedStock(null)
    setQuantity('')
    setPurchasePrice('')
    setPurchaseDate('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedStock) {
      toast.error('Please select a stock')
      return
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }
    if (!purchasePrice || parseFloat(purchasePrice) <= 0) {
      toast.error('Please enter a valid purchase price')
      return
    }
    if (!purchaseDate) {
      toast.error('Please select a purchase date')
      return
    }

    addMutation.mutate({
      stock_symbol: selectedStock,
      quantity: parseFloat(quantity),
      purchase_price: parseFloat(purchasePrice),
      purchase_date: purchaseDate,
    })
  }

  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-6 md:px-12 lg:px-16 py-section">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Portfolio</h1>
                <p className="text-muted-foreground mt-1">Track your investments and performance</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add Position</span>
              </button>
            </div>

            {/* Add Position Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 glass-card rounded-2xl mb-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-lg text-foreground">Add New Position</h2>
                      <button
                        onClick={resetForm}
                        className="p-1 hover:bg-white/10 rounded-lg transition"
                      >
                        <X className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Stock Search */}
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Search Stock
                        </label>
                        {selectedStock ? (
                          <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="font-bold text-primary">{selectedStock.charAt(0)}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-foreground">{selectedStock}</span>
                                <p className="text-xs text-muted-foreground">Selected stock</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedStock(null)}
                              className="p-1 hover:bg-white/10 rounded transition"
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        ) : (
                          <StockSearch onSelect={handleStockSelect} />
                        )}
                      </div>

                      {/* Form Fields Grid */}
                      <div className="grid md:grid-cols-3 gap-4">
                        {/* Quantity */}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">
                            <Hash className="inline h-4 w-4 mr-1" />
                            Quantity
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="e.g., 10"
                            required
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                          />
                        </div>

                        {/* Purchase Price */}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">
                            <DollarSign className="inline h-4 w-4 mr-1" />
                            Purchase Price (USD)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(e.target.value)}
                            placeholder="e.g., 150.00"
                            required
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                          />
                        </div>

                        {/* Purchase Date */}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Purchase Date
                          </label>
                          <input
                            type="date"
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            required
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                          />
                        </div>
                      </div>

                      {/* Estimated Value Preview */}
                      {selectedStock && quantity && purchasePrice && (
                        <EstimatedCostPreview 
                          quantity={parseFloat(quantity)} 
                          price={parseFloat(purchasePrice)} 
                          currency={currency}
                        />
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={addMutation.isPending || !selectedStock}
                        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium"
                      >
                        {addMutation.isPending ? (
                          <span className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Adding...</span>
                          </span>
                        ) : (
                          `Add ${selectedStock || 'Position'} to Portfolio`
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Portfolio Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="p-6 glass-card rounded-2xl border border-white/10">
                <div className="text-sm text-muted-foreground mb-2">Total Cost</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(convertedTotalCost, currency)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Original investment
                </div>
              </div>
              <div className="p-6 glass-card rounded-2xl border border-white/10">
                <div className="text-sm text-muted-foreground mb-2">Current Value</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(convertedTotalValue, currency)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Market value today
                </div>
              </div>
              <div className={`p-6 glass-card rounded-2xl border ${totalPL >= 0 ? 'border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5' : 'border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5'}`}>
                <div className="text-sm text-muted-foreground mb-2">Total P/L</div>
                <div className={`flex items-center space-x-2 text-2xl font-bold ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalPL >= 0 ? (
                    <TrendingUp className="h-6 w-6" />
                  ) : (
                    <TrendingDown className="h-6 w-6" />
                  )}
                  <span>
                    {formatCurrency(convertedTotalPL, currency)}
                  </span>
                </div>
                <div className={`text-sm font-medium mt-1 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Items */}
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : portfolio && portfolio.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.map((item) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  onDelete={(id) => {
                    if (confirm('Remove this position?')) {
                      deleteMutation.mutate(id)
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center glass-card rounded-2xl border border-white/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <p className="text-foreground font-medium mb-2">Your portfolio is empty</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add positions to start tracking your investments
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
              >
                Add Your First Position
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
