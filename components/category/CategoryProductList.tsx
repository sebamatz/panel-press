import { useState } from "react"
import { ProductCombobox, ComboboxItem } from "@/components/ui/combobox"
import { useApiStore } from "@/lib/stores/apiStore"

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
  const { fetchColumnSchema } = useApiStore()

  const handleProductSelect = (item: ComboboxItem | null) => {
    setSelectedItem(item)
    onProductSelect?.(item?.id || null)
    
    // Fetch column schema when a category is selected
    if (item?.id) {
      fetchColumnSchema(categoryId, item.id)
    }
  }

  return (
    <div className="space-y-4">
      <ProductCombobox 
        title="Επιλέξτε Κατηγορία"  
        value={selectedItem} 
        onValueChange={handleProductSelect} 
        products={products} 
      />
    </div>
  )
} 