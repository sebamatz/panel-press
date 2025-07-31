import { toast } from 'sonner'

// Toast utility functions
export const showToast = {
  // Success messages
  success: (message: string, title?: string) => {
    toast.success(title || 'Success', {
      description: message,
      duration: 4000,
    })
  },

  // Error messages
  error: (message: string, title?: string) => {
    toast.error(title || 'Error', {
      description: message,
      duration: 6000,
    })
  },

  // Warning messages
  warning: (message: string, title?: string) => {
    toast.warning(title || 'Warning', {
      description: message,
      duration: 5000,
    })
  },

  // Info messages
  info: (message: string, title?: string) => {
    toast.info(title || 'Info', {
      description: message,
      duration: 4000,
    })
  },

  // Loading messages
  loading: (message: string, title?: string) => {
    return toast.loading(title || 'Loading', {
      description: message,
    })
  },

  // Promise-based success/error
  promise: <T>(
    promise: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Success!',
      error = 'Something went wrong',
    }: {
      loading?: string
      success?: string
      error?: string
    } = {}
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    })
  },
}

// JavaScript error handler
export const handleJSError = (error: Error | string, context?: string) => {
  const errorMessage = typeof error === 'string' ? error : error.message
  const errorTitle = context ? `${context} Error` : 'JavaScript Error'
  
  console.error('JavaScript Error:', error)
  
  showToast.error(errorMessage, errorTitle)
}

// API error handler
export const handleAPIError = (error: any, endpoint?: string) => {
  let errorMessage = 'An unexpected error occurred'
  let errorTitle = 'API Error'

  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else if (error?.message) {
    errorMessage = error.message
  } else if (error?.error) {
    errorMessage = error.error
  }

  if (endpoint) {
    errorTitle = `API Error: ${endpoint}`
  }

  console.error('API Error:', { error, endpoint })
  showToast.error(errorMessage, errorTitle)
}

// Success handler
export const handleSuccess = (message: string, context?: string) => {
  const title = context ? `${context} Success` : 'Success'
  showToast.success(message, title)
}

// Global error handler setup
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handleJSError(event.reason, 'Unhandled Promise Rejection')
  })

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    handleJSError(event.error || event.message, 'JavaScript Error')
  })

  // Handle async errors
  window.addEventListener('error', (event) => {
    if (event.error) {
      handleJSError(event.error, 'Async Error')
    }
  })
}

export default showToast 