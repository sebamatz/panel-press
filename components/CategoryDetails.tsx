"use client"

import { ArrowLeft, Download, Eye, FileText, Loader2, Package, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoCard } from "@/components/ui/InfoCard"
import { StatusCard } from "@/components/ui/StatusCard"
import { Section } from "@/components/ui/Section"
import { useGetCategoryDetailsQuery } from "@/lib/api"
import { ProductCombobox, ComboboxItem } from "@/components/ui/combobox"
import * as React from "react"

interface CategoryDetailsProps {
  categoryId: string | number
  categoryName: string
  onBack: () => void
}

export function CategoryDetailsComponent({ categoryId, categoryName, onBack }: CategoryDetailsProps) {
  const { data: details, isLoading: loading, error } = useGetCategoryDetailsQuery(categoryId)
  const [selectedItem, setSelectedItem] = React.useState<ComboboxItem | null>(null)

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Επιστροφή
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
        </div>

        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Φόρτωση λεπτομερειών κατηγορίας...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Επιστροφή
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
        </div>

        <Alert className="max-w-md mx-auto">
          <AlertDescription>Σφάλμα κατά τη φόρτωση των λεπτομερειών: {error ? (typeof error === 'string' ? error : 'Unknown error') : 'Unknown error'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Use API data if available
  const items = details?.items || []
  
  // Check if we have items from API
  const hasApiItems = details?.items && details.items.length > 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Επιστροφή
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{details?.name || categoryName}</h1>
        <Badge variant="outline">ID: {categoryId}</Badge>
      </div>

      {details?.description && (
        <Card>
          <CardHeader>
            <CardTitle>Περιγραφή Κατηγορίας</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{details.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Show combobox if items are available */}
      {hasApiItems ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Επιλέξτε Προϊόν</h2>
            <Badge variant="secondary">{items.length} προϊόντα διαθέσιμα</Badge>
          </div>
          
          <ProductCombobox
            products={items}
            value={selectedItem}
            onValueChange={setSelectedItem}
            loading={loading}
          />

          {/* Show selected item details */}
          {selectedItem && (
            <Card className="mt-4 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Επιλεγμένο Προϊόν</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-900">{selectedItem.name}</h3>
                      {selectedItem.description && (
                        <p className="text-sm text-green-700 mt-1">{selectedItem.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Προβολή
                    </Button>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Προσθήκη
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Show no data message when API returns empty items */
        <StatusCard
          status="info"
          title="Δεν βρέθηκαν στοιχεία"
          showBadge={false}
        >
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p>
              Το API επέστρεψε δεδομένα αλλά δεν βρέθηκαν στοιχεία για αυτή την κατηγορία.
            </p>
          </div>
        </StatusCard>
      )}

      {/* Enhanced Debug information - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info (Development Only)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Category ID:</strong> {categoryId}
              </div>
              <div>
                <strong>API URL:</strong> https://www.alfaeorders.com:19443/erpapi/getitems/obj
              </div>
              <div>
                <strong>Payload:</strong> {`{Company: 20, BOption: 70, id: ${categoryId}}`}
              </div>
              <div>
                <strong>Items Found:</strong> {items.length}
              </div>
              <div>
                <strong>Data Type:</strong> {details ? typeof details : 'null'}
              </div>
              <div>
                <strong>Has Items Array:</strong> {hasApiItems ? 'Yes' : 'No'}
              </div>
            </div>
            
            <details className="mt-4">
              <summary className="cursor-pointer font-medium text-sm">Raw API Response</summary>
              <pre className="text-xs text-gray-600 overflow-auto mt-2 p-2 bg-gray-100 rounded">
                {JSON.stringify(details, null, 2)}
              </pre>
            </details>
            
            <details className="mt-2">
              <summary className="cursor-pointer font-medium text-sm">Processed Items</summary>
              <pre className="text-xs text-gray-600 overflow-auto mt-2 p-2 bg-gray-100 rounded">
                {JSON.stringify(items, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
