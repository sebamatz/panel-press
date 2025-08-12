"use client"

import { ArrowLeft, Download, Eye, FileText, Loader2, Package, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoCard } from "@/components/ui/info-card"
import { StatusCard } from "@/components/ui/status-card"
import { Section } from "@/components/ui/section"
import { useGetCategoryDetailsQuery } from "@/lib/api"
import { CategoryDetailsHeader } from "./category/CategoryDetailsHeader"

interface CategoryDetailsProps {
  categoryId: string | number
  categoryName: string
  onBack: () => void
}

export function CategoryDetailsComponent({ categoryId, categoryName, onBack }: CategoryDetailsProps) {
  const { data: details, isLoading: loading, error } = useGetCategoryDetailsQuery(categoryId)

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
      <CategoryDetailsHeader categoryId={categoryId} categoryName={categoryName} onBack={onBack} />
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

      {/* Show items if available */}
      {hasApiItems ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any, index: number) => (
            <Card key={item.id || index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-gray-900 text-sm md:text-base">{item.name}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Νέο
                  </Badge>
                </div>
             
              </CardContent>
            </Card>
          ))}
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
    </div>
  )
}
