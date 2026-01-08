import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App'
import './index.css'

// Ensure dark mode is applied immediately
if (!document.documentElement.classList.contains('dark')) {
  document.documentElement.classList.add('dark')
}

// Remove loading indicator
const loadingEl = document.getElementById('loading')
if (loadingEl) {
  loadingEl.remove()
}

// Production-ready QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 2
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
})

// Production error handling
if (import.meta.env.PROD) {
  // Only log errors in production, not debug info
  const originalError = console.error
  console.error = (...args) => {
    // Only log actual errors, not warnings
    if (args[0]?.toString().includes('Warning')) {
      return
    }
    originalError(...args)
  }
}

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  if (import.meta.env.PROD) {
    // In production, you might want to send this to an error tracking service
    // Example: Sentry, LogRocket, etc.
    console.error('Unhandled error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    })
  }
})

window.addEventListener('unhandledrejection', (event) => {
  if (import.meta.env.PROD) {
    console.error('Unhandled promise rejection:', event.reason)
  }
})

try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
} catch (error) {
  // Fatal error - show user-friendly message
  const rootEl = document.getElementById('root')
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; color: #F2F2F2; background: #0D0D12; min-height: 100vh; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center; max-width: 600px;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">Unable to Load Application</h1>
          <p style="color: #9CA3AF; margin-bottom: 24px;">We're sorry, but the application failed to load. Please refresh the page or contact support if the problem persists.</p>
          <button onclick="window.location.reload()" style="background: #3B82F6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 500;">
            Refresh Page
          </button>
        </div>
      </div>
    `
  }
  if (!import.meta.env.PROD) {
    console.error('Fatal error rendering React:', error)
  }
}
