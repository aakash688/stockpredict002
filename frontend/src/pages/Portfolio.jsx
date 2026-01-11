import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PortfolioCard from '../components/portfolio/PortfolioCard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { portfolioService } from '../services/portfolioService'
import { formatCurrency } from '../utils/formatters'
import { Loader2, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { useToast } from '../components/ui/Toast'

export default function Portfolio() {
  const queryClient = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)
  const toast = useToast()
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
      setShowAddForm(false)
      toast.success('Position added to portfolio!')
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to add position. Please check the stock symbol.'
      toast.error(message)
    },
  })

  const totalCost = portfolio?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0
  const totalValue = portfolio?.reduce((sum, item) => sum + (item.current_value || 0), 0) || 0
  const totalPL = totalValue - totalCost
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    addMutation.mutate({
      stock_symbol: formData.get('symbol'),
      quantity: parseFloat(formData.get('quantity')),
      purchase_price: parseFloat(formData.get('price')),
      purchase_date: formData.get('date'),
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-6 md:px-12 lg:px-16 py-section">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Position</span>
            </button>
          </div>

          {showAddForm && (
            <div className="p-6 glass-card rounded-2xl mb-4">
              <h2 className="font-bold mb-4 text-foreground">Add New Position</h2>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
                <input
                  name="symbol"
                  placeholder="Symbol (e.g., AAPL)"
                  required
                  className="px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <input
                  name="quantity"
                  type="number"
                  step="0.01"
                  placeholder="Quantity"
                  required
                  className="px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Purchase Price"
                  required
                  className="px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <input
                  name="date"
                  type="date"
                  required
                  className="px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <button
                  type="submit"
                  disabled={addMutation.isLoading}
                  className="md:col-span-4 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {addMutation.isLoading ? 'Adding...' : 'Add Position'}
                </button>
              </form>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 bg-card border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Total Cost</div>
              <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
            </div>
            <div className="p-6 bg-card border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Current Value</div>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            </div>
            <div className="p-6 bg-card border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Total P/L</div>
              <div className={`flex items-center space-x-2 text-2xl font-bold ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalPL >= 0 ? (
                  <TrendingUp className="h-6 w-6" />
                ) : (
                  <TrendingDown className="h-6 w-6" />
                )}
                <span>
                  {formatCurrency(totalPL)} ({totalPLPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

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
          <div className="p-8 text-center bg-card border rounded-lg">
            <p className="text-muted-foreground mb-4">Your portfolio is empty.</p>
            <p className="text-sm text-muted-foreground">
              Add positions to track your investments.
            </p>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

