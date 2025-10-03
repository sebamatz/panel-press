// Re-export types and store from the Zustand store
export type { CategoryItem, CategoryDetails, ProductDetails } from './stores/apiStore'
export { useApiStore } from './stores/apiStore'

// Create hooks that mimic RTK Query behavior for easier migration
import { useApiStore } from './stores/apiStore'
import { useEffect } from 'react'

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

// Hook for fetching product details
export function useGetProductDetailsQuery({ productId, categoryId = 1 }: { productId: string | number; categoryId?: string | number }) {
  const { 
    productDetails, 
    productDetailsLoading, 
    productDetailsError, 
    fetchProductDetails 
  } = useApiStore()

  const key = `${productId}-${categoryId}`
  const details = productDetails[key]
  const loading = productDetailsLoading[key] || false
  const error = productDetailsError[key] || null

  useEffect(() => {
    if (!details && !loading && !error) {
      fetchProductDetails(productId, categoryId)
    }
  }, [productId, categoryId, details, loading, error, fetchProductDetails])

  return {
    data: details,
    isLoading: loading,
    error: error,
    refetch: () => fetchProductDetails(productId, categoryId)
  }
}

// Hook for fetching product details list (ProductDetailsList)
export function useGetProductDetailsListQuery({ baseCategory, lastId, searchValue = "" }: { baseCategory: string | number; lastId: string | number; searchValue?: string }, options?: { skip?: boolean }) {
  const { 
    productDetailsList, 
    productDetailsListLoading, 
    productDetailsListError, 
    fetchProductDetailsList 
  } = useApiStore()

  const key = `${baseCategory}-${lastId}-${searchValue}`
  const details = productDetailsList[key]
  const loading = productDetailsListLoading[key] || false
  const error = productDetailsListError[key] || null

  useEffect(() => {
    // Only fetch if not skipped and conditions are met
    if (!options?.skip && !details && !loading && !error) {
      fetchProductDetailsList(baseCategory, lastId, searchValue)
    }
  }, [baseCategory, lastId, searchValue, details, loading, error, fetchProductDetailsList, options?.skip])

  return {
    data: details,
    isLoading: loading,
    error: error,
    refetch: () => fetchProductDetailsList(baseCategory, lastId, searchValue)
  }
}