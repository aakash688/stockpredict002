import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StockChart from '../components/stock/StockChart'
import PredictionView from '../components/stock/PredictionView'
import { useStockInfo, useStockHistory, useStockNews } from '../hooks/useStocks'
import { useAddToWatchlist } from '../hooks/useWatchlist'
import { useCurrencyStore } from '../store/currencyStore'
import { useCurrencyConversion } from '../hooks/useCurrency'
import { formatCurrency, formatPercent, formatDateTime, formatMarketCap, formatVolume } from '../utils/formatters'
import { TrendingUp, TrendingDown, Plus, Loader2, Newspaper } from 'lucide-react'

export default function StockDetail() {
  const { symbol } = useParams()
  const [period, setPeriod] = useState('1mo')
  const { currency } = useCurrencyStore()
  const { data: stockInfo, isLoading: infoLoading } = useStockInfo(symbol)
  const convertedPrice = useCurrencyConversion(stockInfo?.current_price || 0)
  const convertedChange = useCurrencyConversion(stockInfo?.change || 0)
  const convertedMarketCap = useCurrencyConversion(stockInfo?.market_cap || 0)
  const { data: history, isLoading: historyLoading } = useStockHistory(symbol, period)
  const { data: news } = useStockNews(symbol, 5)
  const addToWatchlist = useAddToWatchlist()

  const handleAddToWatchlist = () => {
    addToWatchlist.mutate(
      { symbol, notes: null },
      {
        onSuccess: () => {
          alert('Added to watchlist!')
        },
      }
    )
  }

  if (infoLoading) {
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

  if (!stockInfo) {
    const isIndianStock = symbol && (symbol.includes('.BSE') || symbol.includes('.NS') || symbol.includes('.BO'))
    const baseSymbol = symbol ? symbol.replace(/\.(BSE|NS|BO)$/, '') : ''
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <p className="text-xl font-semibold mb-2">Stock not found</p>
            {isIndianStock && symbol.includes('.BSE') ? (
              <>
                <p className="text-muted-foreground mb-4">
                  Indian stocks with <code className="bg-muted px-1 rounded">.BSE</code> suffix are not supported by Yahoo Finance.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Try searching for:</p>
                  <div className="space-y-1 text-sm">
                    <p>• <code className="bg-background px-2 py-1 rounded">{baseSymbol}.NS</code> (NSE - National Stock Exchange)</p>
                    <p>• <code className="bg-background px-2 py-1 rounded">{baseSymbol}.BO</code> (BSE - Bombay Stock Exchange)</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Note: Not all Indian stocks are available on Yahoo Finance.
                </p>
              </>
            ) : (
              <>
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">⚠️ Yahoo Finance Rate Limited</p>
                  <p className="text-sm text-muted-foreground">
                    Yahoo Finance is currently blocking requests due to rate limiting. This is common with free API access.
                  </p>
                </div>
                <p className="text-muted-foreground mb-2">
                  <strong>Please wait 5-10 minutes</strong> before trying again.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  The system will automatically retry when the rate limit is lifted.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Try again later with these popular stocks:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'].map((s) => (
                      <a
                        key={s}
                        href={`/stock/${s}`}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded hover:opacity-90 transition text-sm"
                      >
                        {s}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isPositive = stockInfo.change_percent >= 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-6 md:px-12 lg:px-16 py-section">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{stockInfo.symbol}</h1>
              <p className="text-xl text-muted-foreground">{stockInfo.name}</p>
            </div>
            <button
              onClick={handleAddToWatchlist}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Watchlist</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 glass-card rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <div className="text-sm text-muted-foreground mb-2">Current Price</div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(convertedPrice, currency)}</div>
              <div className={`flex items-center space-x-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="font-semibold">
                  {formatPercent(stockInfo.change_percent)} ({formatCurrency(convertedChange, currency)})
                </span>
              </div>
            </div>

            {stockInfo.volume && (
              <div className="p-6 glass-card rounded-2xl">
                <div className="text-sm text-muted-foreground mb-2">Volume</div>
                <div className="text-2xl font-bold break-words">{formatVolume(stockInfo.volume)}</div>
              </div>
            )}

            {stockInfo.market_cap && (
              <div className="p-6 glass-card rounded-2xl">
                <div className="text-sm text-muted-foreground mb-2">Market Cap</div>
                <div className="text-2xl font-bold number-format">
                  {currency === 'INR' ? '₹' : '$'}{formatMarketCap(convertedMarketCap, currency)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="p-6 glass-card rounded-2xl">
            {historyLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <StockChart
                data={history?.data || []}
                period={period}
                onPeriodChange={setPeriod}
              />
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="p-6 glass-card rounded-2xl">
            <PredictionView symbol={symbol} historicalData={history?.data} />
          </div>
        </div>

        {news && news.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <Newspaper className="h-6 w-6" />
              <span>Recent News</span>
            </h2>
            <div className="space-y-4">
              {news.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 glass-card glass-card-hover rounded-2xl"
                >
                  <h3 className="font-semibold mb-2">{item.headline}</h3>
                  {item.summary && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {item.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>{formatDateTime(item.datetime)}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

