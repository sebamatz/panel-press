"use client"

import { useParams, useRouter } from "next/navigation"
import { useGetCategoryDetailsQuery } from "@/lib/api"
import { Header } from "@/components/header"
import { useState } from "react"
import {
  CategoryLoadingState,
  CategoryErrorState,
  CategoryDetailsHeader,
  CategoryProductSelector,
  CategoryEmptyState,
  CategoryDebugInfo,
  extractCategoryName
} from "@/components/category"
import { ProductDetailsList } from "@/components/category/ProductDetailsList"
import { CategoryProductList } from "@/components/category/CategoryProductList"
import { OrderTable } from "@/components/category/OrderTable"

export default function CategoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  const { data: details, isLoading: loading, error } = useGetCategoryDetailsQuery(categoryId)
  const [selectedProductId, setSelectedProductId] = useState<string | number | null>(null)
  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null)
  const [isProductDetailsEnabled, setIsProductDetailsEnabled] = useState<boolean>(false)

  const handleBack = () => {
    router.push("/")
  }

  const handleProductSelect = (productId: string | number | null) => {
    setSelectedProductId(productId)
    // Enable ProductDetailsList when a product is selected from CategoryProductList
    if (productId) {
      setIsProductDetailsEnabled(true)
    }
  }

  const handleProductDetailsSelection = (selectedItem: any) => {
    setSelectedProductDetails(selectedItem)
  }

  const handleEnableProductDetails = () => {
    setIsProductDetailsEnabled(true)
  }

  const handleDisableProductDetails = () => {
    setIsProductDetailsEnabled(false)
    setSelectedProductDetails(null)
  }

  // Use the processed items directly from the Redux store
  const apiItems = details?.items || []
  const categoryName = extractCategoryName(details, categoryId)

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6 max-w-7xl mx-auto px-4">
            <CategoryLoadingState categoryId={categoryId} onBack={handleBack} />
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6 max-w-7xl mx-auto px-4">
            <CategoryErrorState categoryId={categoryId} error={error ? (typeof error === 'string' ? error : 'Unknown error') : 'Unknown error'} onBack={handleBack} />
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6 max-w-7xl mx-auto px-4">
          <CategoryDetailsHeader
            categoryId={categoryId}
            categoryName={categoryName}
            onBack={handleBack}
          />

            {/* Display actual API data */}
            {apiItems.length > 0 ? (
              <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product List */}
              <div>
                <CategoryProductList 
                     products={apiItems} 
                  onProductSelect={handleProductSelect}
                />
                </div>              
              {/* Product Details Panel */}
              <div>
                <ProductDetailsList 
                  productId={selectedProductId} 
                  categoryId={categoryId} 
                  onSelectionChange={handleProductDetailsSelection}
                  enabled={isProductDetailsEnabled}
                /> 
              </div>
            </div>
            <OrderTable 
              productId={selectedProductId} 
              selectedProductDetails={selectedProductDetails}
              onEnableProductDetails={handleEnableProductDetails}
              onDisableProductDetails={handleDisableProductDetails}
            />

            </div>
          ) : (
            <CategoryEmptyState />
            )}

            {/* Debug information - shows in development */}
          <CategoryDebugInfo
            categoryId={categoryId}
            details={details}
            apiItems={apiItems}
          />
          </div>
        </main>
    </>
  )
}
