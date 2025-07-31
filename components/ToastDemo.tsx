'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showToast, handleJSError, handleSuccess, handleAPIError } from '@/lib/toast'

export function ToastDemo() {
  const testSuccess = () => {
    showToast.success('This is a success message!', 'Operation Completed')
  }

  const testError = () => {
    showToast.error('This is an error message!', 'Something Went Wrong')
  }

  const testWarning = () => {
    showToast.warning('This is a warning message!', 'Warning')
  }

  const testInfo = () => {
    showToast.info('This is an info message!', 'Information')
  }

  const testLoading = () => {
    const loadingToast = showToast.loading('Processing your request...', 'Loading')
    
    // Simulate async operation
    setTimeout(() => {
      if (typeof loadingToast === 'object' && 'dismiss' in loadingToast) {
        (loadingToast as any).dismiss()
      }
      showToast.success('Operation completed successfully!')
    }, 3000)
  }

  const testPromise = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('Success!')
        } else {
          reject(new Error('Random failure'))
        }
      }, 2000)
    })

    showToast.promise(promise, {
      loading: 'Processing...',
      success: 'Operation completed!',
      error: 'Operation failed!',
    })
  }

  const testJSError = () => {
    try {
      throw new Error('This is a test JavaScript error')
    } catch (error) {
      handleJSError(error as Error, 'Test Error')
    }
  }

  const testAPIError = () => {
    const mockError = new Error('API request failed')
    handleAPIError(mockError, '/api/test')
  }

  const testConsoleError = () => {
    console.error('This is a console error that should show as toast')
  }

  const testConsoleWarning = () => {
    console.warn('This is a console warning that should show as toast')
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Toast Notification Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={testSuccess} variant="default">
            Success Toast
          </Button>
          <Button onClick={testError} variant="destructive">
            Error Toast
          </Button>
          <Button onClick={testWarning} variant="outline">
            Warning Toast
          </Button>
          <Button onClick={testInfo} variant="outline">
            Info Toast
          </Button>
          <Button onClick={testLoading} variant="outline">
            Loading Toast
          </Button>
          <Button onClick={testPromise} variant="outline">
            Promise Toast
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Error Handling Tests</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={testJSError} variant="outline" size="sm">
              Test JS Error
            </Button>
            <Button onClick={testAPIError} variant="outline" size="sm">
              Test API Error
            </Button>
            <Button onClick={testConsoleError} variant="outline" size="sm">
              Console Error
            </Button>
            <Button onClick={testConsoleWarning} variant="outline" size="sm">
              Console Warning
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 