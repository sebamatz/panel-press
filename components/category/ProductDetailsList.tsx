import { useApiStore } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Package, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { Combobox } from "../ui/combobox"
import { useParams } from "next/navigation"
import { fetchCategoryProducts } from "@/api/categories"

interface ProductDetailsPanelProps {
  onSelectionChange?: (selectedItem: any) => void
  enabled?: boolean
}

export function ProductDetailsList({onSelectionChange}: ProductDetailsPanelProps) {
  const params = useParams()
  const { selectedCategoryDetails } = useApiStore()
  const categoryId: any = params.id

  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectionChange = (item: any) => {
    onSelectionChange?.(item)
    setSelectedItem(item)
  }

  const handleSearch = async (value: string) => {
    try {
      setError(null)
      setLoading(true)
      setItems([])
      const data = await fetchCategoryProducts(
        categoryId as string | number,
        selectedCategoryDetails as string | number,
        value || ""
      )
      setItems(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || "Unknown error")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const apiItems = (Array.isArray(items) ? items : []).map((item: any) => ({
    id: item?.SKU ?? item?.sku ?? item?.id ?? item?.Id,
    name: item?.SKU ?? item?.sku ?? String(item?.id ?? ""),
    sku: item?.SKU ?? item?.sku ?? String(item?.id ?? ""),
    webName: item?.WebName ?? item?.webName ?? String(item?.id ?? ""),
    xdocname: item?.XDOCNAME ?? item?.xdocname ?? String(item?.id ?? ""),
  }))

  return (
    <div className="space-y-4">
      {error && (
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
      )}
          <Combobox
            placeholder={selectedCategoryDetails ? "Επιλέξτε Προϊόντα" : "Επιλέξτε σειρά πρώτα"}
            value={selectedItem}
            handleSearch={handleSearch}
            onValueChange={handleSelectionChange}
            items={apiItems}
            loading={loading}
            disabled={!selectedCategoryDetails}
            searchPlaceholder="Αναζήτηση κωδικών..."
            emptyMessage={selectedCategoryDetails ? "Δεν βρέθηκαν αποτελέσματα" : "Πρέπει να επιλέξετε σειρά"}
          />
    </div>
  )
}