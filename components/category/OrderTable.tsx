"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { Product } from "./columns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, ShoppingCart } from "lucide-react"

interface OrderTableProps {
  productId?: string | number | null
  selectedProductDetails?: any
  onEnableProductDetails?: () => void
  onDisableProductDetails?: () => void
}

export function OrderTable({ productId, selectedProductDetails, onEnableProductDetails, onDisableProductDetails }: OrderTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  
  // Only show the selected product details, no mock data
  const allProducts = selectedProductDetails ? [
    {
      id: selectedProductDetails.id || `selected-${Date.now()}`,
      code: selectedProductDetails.code || selectedProductDetails.name || "SELECTED",
      name: selectedProductDetails.description || selectedProductDetails.name || "Επιλεγμένο Προϊόν",
      specialRemarks: "",
      dimension: "Custom",
      color: "Ειδική Παραγγελία",
      paintShop: "Custom",
      quantity: 1,
      price: 150.00,
      isSelected: false,
    }
  ] : []

  // Don't show the table if no product is selected
  if (!selectedProductDetails) {
    return null
  }

  const handleAddToOrder = (product: Product) => {
    // Check if product is already in the order
    const existingProduct = selectedProducts.find(p => p.id === product.id)
    if (existingProduct) {
      // Update quantity
      setSelectedProducts(prev => 
        prev.map(p => 
          p.id === product.id 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      )
    } else {
      // Add new product
      setSelectedProducts(prev => [...prev, { ...product, isSelected: true }])
    }
    // Enable ProductDetailsList when adding to order
    onEnableProductDetails?.()
  }

  const handleRemoveFromOrder = (product: Product) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== product.id))
    // Disable ProductDetailsList when removing from order
    onDisableProductDetails?.()
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromOrder({ id: productId } as Product)
      return
    }
    
    setSelectedProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, quantity: newQuantity }
          : p
      )
    )
  }

  const totalPrice = selectedProducts.reduce((sum, product) => {
    return sum + (product.price * product.quantity)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Πίνακας Παραγγελιών</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {selectedProducts.length} προϊόντα επιλεγμένα
          </Badge>
        </div>
      </div>

      {/* Product Selection Table */}
      <DataTable 
        data={allProducts}
        onAddToOrder={handleAddToOrder}
        onRemoveFromOrder={handleRemoveFromOrder}
      />

      {/* Selected Products Summary */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Επιλεγμένα Προϊόντα</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  {/* <div className="flex-1">
                    <div className="font-medium">{product.code} - {product.name}</div>
                    <div className="text-sm text-gray-600">
                      {product.dimension} | {product.color} | {product.paintShop}
                    </div>
                  </div> */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Ποσότητα:</span>
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                    </div>
                    <div className="text-right">
                      <div className="font-medium">€{(product.price * product.quantity).toFixed(2)}</div>
                      <div className="text-sm text-gray-600">€{product.price.toFixed(2)} / τεμ.</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromOrder(product)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Σύνολο:</span>
                  <span className="text-2xl font-bold text-green-600">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedProducts([])}>
                  Καθαρισμός
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Υποβολή Παραγγελίας
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}