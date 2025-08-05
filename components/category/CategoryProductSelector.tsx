import { useState } from "react"
import { ProductCombobox, ComboboxItem } from "@/components/ui/combobox"

interface CategoryProductSelectorProps {
  products: ComboboxItem[]
  onProductSelect?: (productId: string | number | null) => void
}

export function CategoryProductSelector({ 
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
      
      {selectedItem && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900">Selected Product:</h3>
          <p className="text-gray-600">{selectedItem.name}</p>
          {selectedItem.description && (
            <p className="text-sm text-gray-500 mt-1">{selectedItem.description}</p>
          )}
          {selectedItem.code && (
            <p className="text-sm text-gray-500">Code: {selectedItem.code}</p>
          )}
        </div>
      )}
    </div>
  )
} 