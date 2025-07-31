'use client'

import { useAppSelector } from '@/store/hooks'
import { selectCategoriesCount, selectLastFetched } from '@/store/selectors'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Database, AlertCircle } from 'lucide-react'

export function ReduxDebug() {
  const categoriesCount = useAppSelector(selectCategoriesCount)
  const lastFetched = useAppSelector(selectLastFetched)
  const loading = useAppSelector(state => state.categories.loading)
  const error = useAppSelector(state => state.categories.error)

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-gray-900 text-white border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Database className="h-4 w-4 mr-2" />
          Redux Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span>Categories:</span>
          <Badge variant="secondary" className="bg-gray-700 text-white">
            {categoriesCount}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Status:</span>
          <Badge 
            variant="secondary" 
            className={loading ? 'bg-yellow-600' : error ? 'bg-red-600' : 'bg-green-600'}
          >
            {loading ? 'Loading' : error ? 'Error' : 'Ready'}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Last Fetch:
          </span>
          <span className="text-gray-300">{formatTime(lastFetched)}</span>
        </div>

        {error && (
          <div className="flex items-start space-x-2 p-2 bg-red-900/50 rounded">
            <AlertCircle className="h-3 w-3 mt-0.5 text-red-400" />
            <span className="text-red-300 text-xs">{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 