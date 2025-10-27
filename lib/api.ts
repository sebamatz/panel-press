// Re-export types and store from the Zustand store
export type { CategoryItem, CategoryDetails, ProductDetails } from './stores/types'
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