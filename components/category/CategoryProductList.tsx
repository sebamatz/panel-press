import { useState } from "react"
import { ComboboxItem, Combobox } from "@/components/ui/combobox"
import { useApiStore } from "@/lib/stores/appStore"
import { Package } from "lucide-react"
import Image from "next/image"
interface CategoryProductSelectorProps {
  products: ComboboxItem[]
  categoryId: string | number
  onProductSelect?: (productId: string | number | null) => void
}

export function CategoryProductList({ 
  products, 
  categoryId,
  onProductSelect 
}: CategoryProductSelectorProps) {
  const [selectedItem, setSelectedItem] = useState<ComboboxItem | null>(null)
  const { fetchColumnSchema,setSelectedCategoryDetails } = useApiStore()

  const handleProductSelect = (item: ComboboxItem | null) => {
    setSelectedItem(item)
    
    // Fetch column schema when a category is selected
    if (item?.id) {
      setSelectedCategoryDetails(item)
      fetchColumnSchema(categoryId, item.id)
    }
  }

  return (
    <div className="space-y-4 flex gap-4">
       <Combobox
        items={products}
        icon={<Package className="h-5 w-5" />}
        placeholder="Επιλέξτε ένα προϊόν..."
        searchPlaceholder="Αναζήτηση προϊόντων..."
        emptyMessage="Δεν βρέθηκαν προϊόντα."
        showBadge={true}
        badgeText="Νέο"
        title="Επιλέξτε Σειρά"
        showTitle={true}
        badgeCount={products.length}
        badgeLabel="προϊόντα διαθέσιμα"
        value={selectedItem}
        onValueChange={handleProductSelect}
      />
      {selectedItem && selectedItem.imgUrl && (
        <Image src={selectedItem.imgUrl} alt={selectedItem.name} width={100} height={100} /> 
      )}
    </div>
  )
} 