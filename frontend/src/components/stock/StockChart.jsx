import { useState } from 'react'
import Chart from 'react-apexcharts'
import { CHART_PERIODS } from '../../utils/constants'
import { useCurrencyStore } from '../../store/currencyStore'

export default function StockChart({ data, period, onPeriodChange }) {
  const [chartType, setChartType] = useState('area')
  const { currency } = useCurrencyStore()
  
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥'
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No chart data available
      </div>
    )
  }

  // Prepare data for ApexCharts
  const chartData = data.map((item) => ({
    x: new Date(item.date).getTime(),
    y: [item.open, item.high, item.low, item.close],
    close: item.close,
  }))

  const lineData = data.map((item) => ({
    x: new Date(item.date).getTime(),
    y: item.close,
  }))

  const options = {
    chart: {
      type: chartType,
      height: 400,
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    theme: {
      mode: 'dark',
    },
    stroke: {
      curve: 'smooth',
      width: chartType === 'candlestick' ? 1 : 2,
    },
    fill: {
      type: 'gradient',
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
      tooltip: {
        enabled: true,
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
    colors: ['#3B82F6'],
  }

  const candlestickOptions = {
    ...options,
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#22C55E',
          downward: '#EF4444',
        },
        wick: {
          useFillColor: true,
        },
      },
    },
  }

  const series = chartType === 'candlestick'
    ? [{ name: 'Price', data: chartData }]
    : [{ name: 'Price', data: lineData }]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {CHART_PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                period === p.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              chartType === 'area'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              chartType === 'line'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('candlestick')}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              chartType === 'candlestick'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Candles
          </button>
        </div>
      </div>

      <div className="w-full">
        <Chart
          options={chartType === 'candlestick' ? candlestickOptions : options}
          series={series}
          type={chartType}
          height={400}
        />
      </div>
    </div>
  )
}
