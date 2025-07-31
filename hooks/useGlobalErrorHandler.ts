import { useEffect } from 'react'
import { setupGlobalErrorHandling, handleJSError } from '@/lib/toast'

export function useGlobalErrorHandler() {
  useEffect(() => {
    // Set up global error handling
    setupGlobalErrorHandling()

    // Handle console errors
    const originalError = console.error
    console.error = (...args) => {
      originalError.apply(console, args)
      
      // Show toast for console errors in development
      if (process.env.NODE_ENV === 'development') {
        const errorMessage = args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ')
        
        handleJSError(errorMessage, 'Console Error')
      }
    }

    // Handle console warnings
    const originalWarn = console.warn
    console.warn = (...args) => {
      originalWarn.apply(console, args)
      
      // Show toast for console warnings in development
      if (process.env.NODE_ENV === 'development') {
        const warningMessage = args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ')
        
        // Use warning toast for console warnings
        import('@/lib/toast').then(({ showToast }) => {
          showToast.warning(warningMessage, 'Console Warning')
        })
      }
    }

    // Cleanup function
    return () => {
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])
} 