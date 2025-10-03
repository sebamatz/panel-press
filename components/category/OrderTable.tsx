"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Trash2, ShoppingCart, Check, ChevronsUpDown, Package } from "lucide-react"
import { useApiStore } from "@/lib/stores/apiStore"
import { useGetProductDetailsListQuery } from "@/lib/api"

interface OrderTableProps {
  productId?: string | number | null
  selectedProductDetails?: any
  onEnableProductDetails?: () => void
  onDisableProductDetails?: () => void
  categoryId?: string | number
  products?: any[]
  onProductSelect?: (productId: string | number | null) => void
  productDetailsData?: any[]
}

export function OrderTable({ productId, selectedProductDetails, onEnableProductDetails, onDisableProductDetails, categoryId, products, onProductSelect }: OrderTableProps) {
  type Product = {
    id: string
    code: string
    name: string
    specialRemarks: string
    dimension: string
    color: string
    paintShop: string
    quantity: number
    price: number
    isSelected: boolean
    // Allow dynamic fields from forms
    [key: string]: any
  }

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | number | null>(null)
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({})
  const [productSearchOpen, setProductSearchOpen] = useState(false)
  const [productSearchValue, setProductSearchValue] = useState("")
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("")
  const { columnSchemas, fetchColumnSchema } = useApiStore()
  
  // Get the schema for the current category
  const schemaKey = categoryId ? `${categoryId}-1` : null
  let currentSchema = schemaKey ? columnSchemas[schemaKey] : null
  
  // If no specific schema found, look for any schema for this category
  if (!currentSchema && categoryId) {
    const categorySchemas = Object.keys(columnSchemas).filter(key => key.startsWith(`${categoryId}-`))
    if (categorySchemas.length > 0) {
      currentSchema = columnSchemas[categorySchemas[0]]
    }
  }

  // Debounce the search value to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(productSearchValue)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [productSearchValue])

  // Fetch schema if not available
  React.useEffect(() => {
    if (categoryId && !currentSchema) {
      fetchColumnSchema(categoryId, 1)
    }
  }, [categoryId, currentSchema, fetchColumnSchema])

  // Product search functionality
  const shouldFetch = debouncedSearchValue && debouncedSearchValue.length > 0
  const { data: productDetails, isLoading: productLoading, error: productError } = useGetProductDetailsListQuery({
    baseCategory: categoryId!,
    lastId: 1,
    searchValue: debouncedSearchValue
  }, {
    skip: !shouldFetch || !categoryId
  })

  // Show the table only if we have a category selection and schema available
  if (!categoryId || !currentSchema || currentSchema.length === 0) {
    return null
  }

  // Additional check: don't render if categoryId is invalid or empty
  if (!categoryId || categoryId === '' || categoryId === 'undefined') {
    return null
  }

  // Utility function to parse JSON values
  const parseJsonValues = (valuesString: string): any[] => {
    if (!valuesString || valuesString.trim() === '') return []
    try {
      return JSON.parse(valuesString)
    } catch (error) {
      console.warn('Failed to parse values JSON:', error)
      return []
    }
  }

  // Convert API data to dropdown options
  const apiItems = (productDetails || []).map((item: any, index: number) => ({
    id: item?.SKU || `item-${index}`,
    name: item?.SKU || `Item ${index + 1}`,
    description: item?.WebName || '',
    code: item?.SKU || '',
    xdocname: item?.XDOCNAME || '',
    icon: <Package className="h-4 w-4" />,
  })).filter(item => item.id && item.name)

  // Filter items based on search
  const filteredItems = apiItems.filter(item => {
    if (!productSearchValue) return true
    return (
      (item.name && item.name.toLowerCase().includes(productSearchValue.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(productSearchValue.toLowerCase()))
    )
  })

  const selectedProduct = apiItems.find(item => item.id === selectedProductId)

  const handleProductSelect = (productId: string | number | null) => {
    setSelectedProductId(productId)
    onProductSelect?.(productId)
    onEnableProductDetails?.()
    setProductSearchOpen(false)
    setProductSearchValue("")
  }

  const handleFieldUpdate = (field: string, value: any) => {
    setFieldValues(prev => ({ ...prev, [field]: value }))
  }

  const handleAddToOrder = () => {
    if (!selectedProductId) return

    const newProduct: Product = {
      id: `product-${selectedProductId}`,
      code: String(selectedProductId),
      name: selectedProductDetails?.description || selectedProductDetails?.name || "Επιλεγμένο Προϊόν",
      specialRemarks: "",
      dimension: "",
      color: "",
      paintShop: "",
      quantity: 1,
      price: 0.00,
      isSelected: true,
      ...fieldValues
    }

    // Check if product is already in the order
    const existingProduct = selectedProducts.find(p => p.code === String(selectedProductId))
    if (existingProduct) {
      // Update quantity
      setSelectedProducts(prev => 
        prev.map(p => 
          p.code === String(selectedProductId)
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      )
    } else {
      // Add new product
      setSelectedProducts(prev => [...prev, newProduct])
    }
  }

  const handleRemoveFromOrder = (product: Product) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== product.id))
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

  // Dynamic Field Component
  const DynamicField = ({ column, value, onUpdate }: { column: any; value: any; onUpdate?: (value: any) => void }) => {
    const hasValues = column.values && column.values.trim() !== ''
    
    // If column has values, render select
    if (hasValues) {
      let options: any[] = []
      
      try {
        const parsed = JSON.parse(column.values)
        // Ensure options is always an array
        if (Array.isArray(parsed)) {
          options = parsed
        } else if (parsed && typeof parsed === 'object') {
          // If it's an object, try to find an array property
          const possibleArrays = Object.values(parsed).filter(Array.isArray)
          if (possibleArrays.length > 0) {
            options = possibleArrays[0]
          } else {
            // Convert object to array of key-value pairs
            options = Object.entries(parsed).map(([key, val]) => ({ value: key, label: val }))
          }
        } else {
          // If it's a single value, wrap it in an array
          options = [parsed]
        }
      } catch (error) {
        console.warn('Failed to parse values JSON:', column.values)
        options = []
      }

      // Ensure options is an array before mapping
      if (!Array.isArray(options)) {
        options = []
      }

      return (
        <Select 
          value={String(value) || ""} 
          onValueChange={(newValue) => onUpdate?.(newValue)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Επιλέξτε ${column.header || column.title}...`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option: any, index: number) => {
              // Handle different option structures
              let optionValue = ''
              let optionLabel = ''
              
              if (typeof option === 'string') {
                optionValue = option
                optionLabel = option
              } else if (typeof option === 'object' && option !== null) {
                optionValue = String(option.value || option.code || option.id || option)
                optionLabel = String(option.label || option.name || option.code || option)
              } else {
                optionValue = String(option)
                optionLabel = String(option)
              }
              
              return (
                <SelectItem key={index} value={optionValue}>
                  {optionLabel}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      )
    }
    
    // If no values, render input
    return (
      <Input 
        placeholder={column.header || column.title || ""}
        value={String(value) || ""}
        className="w-full"
        onChange={(e) => onUpdate?.(e.target.value)}
      />
    )
  }

  return (
    <div>
      <h1>Order Table</h1>

    </div>
  )
}