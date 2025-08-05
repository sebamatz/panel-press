import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryDebugInfoProps {
  categoryId: string
  details: any
  apiItems: any[]
}

export function CategoryDebugInfo({ categoryId, details, apiItems }: CategoryDebugInfoProps) {
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardHeader>
        <CardTitle className="text-sm">Debug Info (Development Only)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-xs">
          <p>
            <strong>Category ID:</strong> {categoryId}
          </p>
          <p>
            <strong>API URL:</strong> https://www.alfaeorders.com:19443/erpapi/getitems/obj
          </p>
          <p>
            <strong>Payload:</strong> {`{Company: 20, BOption: 70, id: ${categoryId}}`}
          </p>
          <p>
            <strong>Items Found:</strong> {apiItems.length}
          </p>
          <p>
            <strong>Data Type:</strong> {Array.isArray(details) ? "Array" : typeof details}
          </p>
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer font-medium">Raw API Response</summary>
          <pre className="text-xs text-gray-600 overflow-auto mt-2 p-2 bg-gray-100 rounded max-h-64">
            {JSON.stringify(details, null, 2)}
          </pre>
        </details>
        <details className="mt-2">
          <summary className="cursor-pointer font-medium">Processed Items</summary>
          <pre className="text-xs text-gray-600 overflow-auto mt-2 p-2 bg-gray-100 rounded max-h-64">
            {JSON.stringify(apiItems, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  )
} 