import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { predictionService } from '../../services/predictionService'
import Chart from 'react-apexcharts'
import { PREDICTION_DAYS } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatters'
import { useCurrencyStore } from '../../store/currencyStore'
import { Loader2, AlertTriangle, Bot, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PredictionView({ symbol, historicalData }) {
  const [days, setDays] = useState(30)
  const { currency } = useCurrencyStore()
  
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥'
  }
  const { data: predictions, isLoading, error } = useQuery({
    queryKey: ['predictions', symbol, days],
    queryFn: () => predictionService.getPredictions(symbol, days),
    enabled: !!symbol,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 glass-card rounded-xl bg-destructive/10 flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <span className="text-destructive">Error loading predictions: {error.message}</span>
      </div>
    )
  }

  // Calculate confidence and trend
  const currentPrice = historicalData?.[historicalData.length - 1]?.close || 0
  const predictedPrice = predictions?.[predictions.length - 1]?.predicted_price || 0
  const priceChange = predictedPrice - currentPrice
  const priceChangePercent = currentPrice > 0 ? (priceChange / currentPrice) * 100 : 0
  const isBullish = priceChange > 0
  
  // Calculate confidence based on prediction range
  const lastPrediction = predictions?.[predictions.length - 1]
  const confidenceRange = lastPrediction ? lastPrediction.upper_bound - lastPrediction.lower_bound : 0
  const confidence = lastPrediction ? Math.max(0, Math.min(100, 100 - (confidenceRange / predictedPrice) * 100)) : 0

  // Prepare data for chart
  const chartData = []
  
  // Add historical data (last 30 days)
  if (historicalData) {
    historicalData.slice(-30).forEach((item) => {
      chartData.push({
        x: new Date(item.date).getTime(),
        y: item.close,
      })
    })
  }

  // Prepare prediction data
  const predictionData = predictions?.map((pred) => ({
    x: new Date(pred.date).getTime(),
    y: pred.predicted_price,
  })) || []

  const options = {
    chart: {
      type: 'line',
      height: 350,
      background: 'transparent',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    theme: {
      mode: 'dark',
    },
    stroke: {
      curve: 'smooth',
      width: [2, 3],
      dashArray: [0, 5],
    },
    colors: ['#3B82F6', '#22D3EE'],
    fill: {
      type: ['solid', 'gradient'],
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 0.1,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#9CA3AF',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF',
        },
        formatter: (value) => `${currencySymbols[currency] || '$'}${value?.toFixed(2) || '0.00'}`,
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd MMM yyyy',
      },
      y: {
        formatter: (value) => `${currencySymbols[currency] || '$'}${value?.toFixed(2) || '0.00'}`,
      },
    },
    legend: {
      show: true,
      labels: {
        colors: '#9CA3AF',
      },
    },
  }

  const series = [
    {
      name: 'Historical',
      data: chartData,
    },
    {
      name: 'AI Prediction',
      data: predictionData,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header with AI branding */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <Bot className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Price Forecast</h3>
            <p className="text-sm text-muted-foreground">Machine Learning Prediction</p>
          </div>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 glass-card rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {PREDICTION_DAYS.map((d) => (
            <option key={d} value={d}>
              {d} days
            </option>
          ))}
        </select>
      </div>

      {/* AI Insights Card */}
      {predictions && predictions.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Prediction Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 glass-card rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
          >
            <div className="text-sm text-muted-foreground mb-1">Expected Price</div>
            <div className="text-2xl font-bold mb-2">{formatCurrency(predictedPrice)}</div>
            <div className={`flex items-center space-x-1 text-sm ${isBullish ? 'text-green-400' : 'text-red-400'}`}>
              {isBullish ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%</span>
              <span className="text-muted-foreground">({formatCurrency(priceChange)})</span>
            </div>
          </motion.div>

          {/* Confidence Score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 glass-card rounded-xl"
          >
            <div className="text-sm text-muted-foreground mb-2">Confidence Score</div>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
              <div className="text-2xl font-bold">{confidence.toFixed(0)}%</div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {confidence > 70 ? 'High confidence' : confidence > 40 ? 'Medium confidence' : 'Low confidence'}
            </div>
          </motion.div>

          {/* Trend Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-4 glass-card rounded-xl ${isBullish ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' : 'bg-gradient-to-br from-red-500/10 to-orange-500/10'}`}
          >
            <div className="text-sm text-muted-foreground mb-2">Market Trend</div>
            <div className="flex items-center space-x-2 mb-1">
              {isBullish ? (
                <TrendingUp className="h-6 w-6 text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-400" />
              )}
              <div className="text-2xl font-bold">{isBullish ? 'Bullish' : 'Bearish'}</div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span>Volatility: Medium</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && predictionData.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-4"
        >
          <Chart options={options} series={series} type="line" height={350} />
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 glass-card rounded-xl border border-yellow-500/20 bg-yellow-500/5"
      >
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          <strong>⚠️ Disclaimer:</strong> AI predictions are for educational purposes only and should not be considered financial advice. 
          Past performance does not guarantee future results. Always do your own research before making investment decisions.
        </p>
      </motion.div>
    </div>
  )
}
