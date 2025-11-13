import { useApiStore } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Package, AlertCircle, ZoomIn } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { Combobox } from "../ui/combobox"
import { useParams } from "next/navigation"
import { fetchCategoryProducts } from "@/api/categories"
import { profilColorsType } from "../colors-selection/OrderOptions"
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface ProductDetailsPanelProps {
  onSelectionChange?: (selectedItem: any) => void
  enabled?: boolean
}

export function ProductDetailsList({onSelectionChange}: ProductDetailsPanelProps) {
  const params = useParams()
  const { selectedCategoryDetails } = useApiStore()
  const {profilColors, colorSelectionState} = useColorSelectionStore();
  const categoryId: any = params.id

  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

  const handleSelectionChange = (item: any) => {
    onSelectionChange?.(item)
    setSelectedItem(item)
  }

  const getColor= () => {


    if(colorSelectionState.length > 0){
      return colorSelectionState[0].colorType;
    }

    if(profilColors === profilColorsType.WHITE){
      return 4;
    }
    return null;
  }

  const handleSearch = async (value: string) => {
    try {
      setError(null)
      setLoading(true)
      setItems([])
      const data = await fetchCategoryProducts(
        categoryId as string | number,
        selectedCategoryDetails as string | number,
        value || "",
        getColor()
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
    imgUrl: item?.imgUrl ?? item?.ImgUrl ?? String(item?.id ?? ""),
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
      <div className="flex flex-col gap-2">
      <div className="flex gap-4">
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
          {selectedItem && (
            <div className="relative group cursor-pointer" onClick={() => setIsImageDialogOpen(true)}>
              <div className="relative min-w-10">
                <Image 
                  src={selectedItem.imgUrl} 
                  alt={selectedItem.name} 
                  width={50} 
                  height={50} 
                  className="rounded-md transition-transform duration-200 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-md transition-colors duration-200 flex items-center justify-center">
                  <ZoomIn className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            </div>
          )}
          </div>
          <div>{selectedItem?.webName}</div>
          <div>{selectedItem?.dimDesign}</div>
          </div>
          
          {selectedItem && (
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
              <DialogContent className="max-w-4xl w-full p-0">
                <DialogHeader className="p-6 pb-4">
                  <DialogTitle>{selectedItem.name || selectedItem.webName || "Product Image"}{selectedItem?.dimDesign??""}{selectedItem?.webName??""}</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
                  <Image
                    src={selectedItem.imgUrl}
                    alt={selectedItem.name || selectedItem.webName || "Product Image"}
                    width={800}
                    height={800}
                    className="max-w-full max-h-full object-contain rounded-md"
                    unoptimized
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}

    </div>
  )
}