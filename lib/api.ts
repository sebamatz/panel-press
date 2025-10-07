// Re-export types and store from the Zustand store
import { fetchProductDetailsList } from '@/api/fetch'
export type { CategoryItem, CategoryDetails, ProductDetails } from './stores/appStore'
export { useApiStore } from './stores/appStore'


// Create hooks that mimic RTK Query behavior for easier migration
import { useApiStore } from './stores/appStore'
import { useEffect, useState } from 'react'

// Hook for fetching base categories
export function useGetBaseCategoriesQuery() {
  const { 
    categories, 
    categoriesLoading, 
    categoriesError, 
    fetchCategories 
  } = useApiStore()

  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading && !categoriesError) {
      fetchCategories()
    }
  }, [categories.length, categoriesLoading, categoriesError, fetchCategories])

  return {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: fetchCategories
  }
}

// Hook for fetching category details
export function useGetCategoryDetailsQuery(categoryId: string | number) {
  const { 
    categoryDetails, 
    categoryDetailsLoading, 
    categoryDetailsError, 
    fetchCategoryDetails 
  } = useApiStore()

  const details = categoryDetails[categoryId]
  const loading = categoryDetailsLoading[categoryId] || false
  const error = categoryDetailsError[categoryId] || null

  useEffect(() => {
    if (!details && !loading && !error) {
      fetchCategoryDetails(categoryId)
    }
  }, [categoryId, details, loading, error, fetchCategoryDetails])

  return {
    data: details,
    isLoading: loading,
    error: error,
    refetch: () => fetchCategoryDetails(categoryId)
  }
}

// Hook for fetching product details list (ProductDetailsList)
export function useGetProductDetailsListQuery({ baseCategory }: { baseCategory: string | number }, options?: { skip?: boolean }) {
 
 const [data, setData] = useState<any>(null)
  const { 
    selectedCategoryDetails,
    productDetailsList, 
    productDetailsListLoading, 
    productDetailsListError, 
  } = useApiStore()
  
  let searchValue = ""
  const key = `${baseCategory}-${selectedCategoryDetails}-${searchValue}`
  const details = productDetailsList[key]
  const loading = productDetailsListLoading[key] || false
  const error = productDetailsListError[key] || null


  const handleSearch = async (value: string) => {
    searchValue = value
    const details = await fetchProductDetailsList(baseCategory, selectedCategoryDetails, searchValue)
    setData(details)

  }



  return {
    data: details,
    isLoading: loading,
    error: error,
    refetch: () => fetchProductDetailsList(baseCategory, lastId, searchValue),
    handleSearch: handleSearch
  }
}