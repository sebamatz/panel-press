import { useState } from "react"
import { ProductCombobox, ComboboxItem } from "@/components/ui/combobox"

interface CategoryProductSelectorProps {
  products: ComboboxItem[]
  onProductSelect?: (productId: string | number | null) => void
}

export function CategoryProductList({ 
  products, 
  onProductSelect 
}: CategoryProductSelectorProps) {
  const [selectedItem, setSelectedItem] = useState<ComboboxItem | null>(null)

  const handleProductSelect = (item: ComboboxItem | null) => {
    setSelectedItem(item)
    onProductSelect?.(item?.id || null)
  }

  return (
    <div className="space-y-4">
      <ProductCombobox 
        title="Επιλέξτε Προϊόν" 
        value={selectedItem} 
        onValueChange={handleProductSelect} 
        products={products} 
      />
    </div>
  )
} 