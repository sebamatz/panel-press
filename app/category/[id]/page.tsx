"use client"

import { useParams, useRouter } from "next/navigation"
import { useGetCategoryDetailsQuery } from "@/lib/api"
import { Header } from "@/components/header"
import { useState } from "react"
import {
  CategoryLoadingState,
  CategoryErrorState,
  CategoryDetailsHeader,
  CategoryEmptyState,
  CategoryDebugInfo,
  extractCategoryName,
  ProductDetailsList
} from "@/components/category"
import { CategoryProductList } from "@/components/category/CategoryProductList"
import  OrderTable  from "@/components/category/OrderTable"
import { useApiStore } from "@/lib/stores/appStore"
import OrderOptions from "@/components/colors-selection/OrderOptions"
export default function CategoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string
  const { columnSchemas } = useApiStore()

  const { data: details, isLoading: loading, error } = useGetCategoryDetailsQuery(categoryId)
  const { setSelectedCategoryDetails } = useApiStore() 
  const handleBack = () => {
    router.push("/")
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

  // log current store state
  console.log("current store state",useApiStore.getState())

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
                     categoryId={categoryId}
                />
                </div>              
            </div>
            </div>
          ) : (
            <CategoryEmptyState />
            )}
            
            {/* Show OrderOptions and OrderTable when there are API items (category loaded) and valid categoryId */}
            {apiItems.length > 0 && categoryId && (
              <>
                <div className="w-full">
                  <OrderOptions isDisabled={false} />
                </div>

                
                {columnSchemas && columnSchemas.length > 0 && <OrderTable columns={columnSchemas || []} />}
              </>
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
