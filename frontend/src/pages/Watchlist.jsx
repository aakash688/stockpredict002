import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WatchlistItem from '../components/watchlist/WatchlistItem'
import StockSearch from '../components/stock/StockSearch'
import { useWatchlist, useAddToWatchlist } from '../hooks/useWatchlist'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../components/ui/Toast'

export default function Watchlist() {
  const { data: watchlist, isLoading } = useWatchlist()
  const addToWatchlist = useAddToWatchlist()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const toast = useToast()

  const handleAdd = () => {
    if (selectedSymbol) {
      addToWatchlist.mutate(
        { symbol: selectedSymbol, notes: null },
        {
          onSuccess: () => {
            toast.success(`${selectedSymbol} added to watchlist!`)
            setSelectedSymbol('')
            setShowAddForm(false)
          },
          onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to add to watchlist'
            toast.error(message)
          },
        }
      )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-6 md:px-12 lg:px-16 py-section">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Watchlist</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stock</span>
            </button>
          </div>

          {showAddForm && (
            <div className="p-4 bg-card border rounded-lg mb-4">
              <StockSearch onSelect={setSelectedSymbol} />
              {selectedSymbol && (
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                >
                  Add {selectedSymbol} to Watchlist
                </button>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : watchlist && watchlist.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((item) => (
              <WatchlistItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-card border rounded-lg">
            <p className="text-muted-foreground mb-4">Your watchlist is empty.</p>
            <p className="text-sm text-muted-foreground">
              Add stocks to track their prices and performance.
            </p>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

