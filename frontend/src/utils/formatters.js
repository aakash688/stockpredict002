export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function formatLargeNumber(value, currency = 'USD') {
  if (!value || isNaN(value)) return '0'
  
  const num = Math.abs(value)
  
  // Indian numbering system (Lakhs, Crores) for INR
  if (currency === 'INR') {
    if (num >= 1e7) {
      // Crores (1 crore = 10 million)
      return `${(num / 1e7).toFixed(2)} Cr`
    }
    if (num >= 1e5) {
      // Lakhs (1 lakh = 100 thousand)
      return `${(num / 1e5).toFixed(2)} L`
    }
    if (num >= 1e3) {
      // Thousands
      return `${(num / 1e3).toFixed(2)} K`
    }
    return num.toFixed(2)
  }
  
  // International numbering system (K, M, B, T) for other currencies
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toFixed(2)
}

export function formatMarketCap(value, currency = 'USD') {
  if (!value || isNaN(value) || value === 0) return 'N/A'
  const formatted = formatLargeNumber(value, currency)
  const sign = value < 0 ? '-' : ''
  return `${sign}${formatted}`
}

export function formatVolume(value) {
  if (!value || isNaN(value)) return 'N/A'
  const num = Math.abs(value)
  
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toLocaleString()
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

