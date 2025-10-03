import { useGetProductDetailsQuery } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { Combobox } from "../ui/combobox"

interface ProductDetailsPanelProps {
  productId: string | number | null
  categoryId: string | number
  onSelectionChange?: (selectedItem: any) => void
  enabled?: boolean
}

export function ProductDetailsList({ productId, categoryId, onSelectionChange, enabled = true }: ProductDetailsPanelProps) {
  const { data: details, isLoading: loading, error } = useGetProductDetailsQuery({
    productId: productId!,
    categoryId
  })
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const handleSelectionChange = (item: any) => {
    setSelectedItem(item)
    onSelectionChange?.(item)
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
              <strong>Σφάλμα κατά τη φόρτωση των λεπτομερειών:</strong> {error ? (typeof error === 'string' ? error : 'Unknown error') : 'Unknown error'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }


  const apiItems = Object.values(details || {}).map((item: any, index: number) => ({
    id: item?.sku,
    name: item?.sku,
    description: item?.webName,
    code: item?.sku,
    icon: <Package className="h-4 w-4" />,
  }))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Προϊόντα - κωδικοί</h2>
    <Card>
      <Combobox
        title="Επιλέξτε Προϊόν"
        value={selectedItem}
        onValueChange={handleSelectionChange}
        items={apiItems}
      />
    </Card>
    </div>
  )
} 