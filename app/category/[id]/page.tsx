"use client"

import { useParams, useRouter } from "next/navigation"
import { useCategoryDetails } from "@/lib/redux-hooks"
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
import { ProductDetailsPanel } from "@/components/category/ProductDetailsPanel"

export default function CategoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  const { details, loading, error } = useCategoryDetails(categoryId)
  const [selectedProductId, setSelectedProductId] = useState<string | number | null>(null)

  const handleBack = () => {
    router.push("/")
  }

  const handleProductSelect = (productId: string | number | null) => {
    setSelectedProductId(productId)
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
            <CategoryErrorState categoryId={categoryId} error={error} onBack={handleBack} />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product List */}
              <div>
                <CategoryProductSelector 
                     products={apiItems} 
                  onProductSelect={handleProductSelect}
                />
                </div>
              
              {/* Product Details Panel */}
              <div>
                <ProductDetailsPanel productId={selectedProductId} categoryId={categoryId} />
              </div>
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
