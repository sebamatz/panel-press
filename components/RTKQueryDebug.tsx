"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetBaseCategoriesQuery, useGetCategoryDetailsQuery } from "@/lib/api"
import { RefreshCw, Database, Zap, Clock } from "lucide-react"

export function RTKQueryDebug() {
  const { 
    data: categories = [], 
    isLoading, 
    error, 
    refetch,
    isFetching,
    isSuccess,
    isError,
    currentData,
    originalArgs
  } = useGetBaseCategoriesQuery()

  const { 
    data: categoryDetails,
    isLoading: detailsLoading,
    isFetching: detailsFetching
  } = useGetCategoryDetailsQuery(1, {
    skip: categories.length === 0
  })

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Database className="h-5 w-5" />
          RTK Query Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant={isLoading ? "destructive" : "default"}>
              {isLoading ? "Loading" : "Ready"}
            </Badge>
            <span>Status</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isFetching ? "secondary" : "outline"}>
              {isFetching ? "Fetching" : "Idle"}
            </Badge>
            <span>Fetching</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isSuccess ? "default" : "outline"}>
              {isSuccess ? "Success" : "Pending"}
            </Badge>
            <span>Success</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isError ? "destructive" : "outline"}>
              {isError ? "Error" : "OK"}
            </Badge>
            <span>Error</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Categories Cache
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>Count:</strong> {categories.length}</p>
              <p><strong>Current Data:</strong> {currentData ? "Available" : "None"}</p>
              <p><strong>Original Args:</strong> {originalArgs ? "Set" : "None"}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Category Details Cache
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>Loading:</strong> {detailsLoading ? "Yes" : "No"}</p>
              <p><strong>Fetching:</strong> {detailsFetching ? "Yes" : "No"}</p>
              <p><strong>Data:</strong> {categoryDetails ? "Available" : "None"}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refetch Categories
          </Button>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            <strong>Error:</strong> {typeof error === 'string' ? error : 'Unknown error'}
          </div>
        )}

        <details className="text-xs">
          <summary className="cursor-pointer font-medium">Raw Categories Data</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32">
            {JSON.stringify(categories, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  )
} 