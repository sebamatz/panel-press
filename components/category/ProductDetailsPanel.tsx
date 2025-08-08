import { useProductDetails } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { Combobox } from "../ui/combobox"

interface ProductDetailsPanelProps {
  productId: string | number | null
  categoryId: string | number
}

export function ProductDetailsPanel({ productId, categoryId }: ProductDetailsPanelProps) {
  const { details, loading, error } = useProductDetails(productId, categoryId)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  if (!productId) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Επιλέξτε Προϊόν</h3>
          <p className="text-sm text-gray-600">
            Επιλέξτε ένα προϊόν από τη λίστα για να δείτε τις λεπτομερείς του.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-green-600 mr-2" />
            <span className="text-gray-600">Φόρτωση λεπτομερειών προϊόντος...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Σφάλμα κατά τη φόρτωση των λεπτομερειών:</strong> {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!details) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Δεν βρέθηκαν λεπτομερείς</h3>
          <p className="text-sm text-gray-600">
            Δεν ήταν δυνατή η φόρτωση των λεπτομερειών για αυτό το προϊόν.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Use the processed items directly from the Redux store

  // is object

  const apiItems = Object.values(details).map((item: any, index: number) => ({
    id: item?.sku,
    name: item?.sku,
    description: item?.webName,
    code: item?.sku,
    icon: <Package className="h-4 w-4" />,
  }))

  return (
    <Card>
      <Combobox
        title="Επιλέξτε Προϊόν"
        value={selectedItem}
        onValueChange={setSelectedItem}
        items={apiItems}

      />
    </Card>
  )
} 