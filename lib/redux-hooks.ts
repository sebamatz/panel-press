import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchCategories, fetchCategoryDetails } from '@/store/slices/categoriesSlice'
import { 
  selectCategories, 
  selectCategoriesLoading, 
  selectCategoriesError, 
  selectLastFetched,
  selectCategoryById
} from '@/store/selectors'

export function useBaseCategories() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const loading = useAppSelector(selectCategoriesLoading)
  const error = useAppSelector(selectCategoriesError)
  const lastFetched = useAppSelector(selectLastFetched)

  const refetch = () => {
    dispatch(fetchCategories())
  }

  useEffect(() => {
    // Only fetch if we don't have data or if it's been more than 5 minutes since last fetch
    if (categories.length === 0 || !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length, lastFetched])

  return { categories, loading, error, refetch }
}

export function useCategoryDetails(categoryId: string | number | null) {
  const dispatch = useAppDispatch()
  const details = useAppSelector(state => selectCategoryById(state, categoryId!))
  const loading = useAppSelector(selectCategoriesLoading)
  const error = useAppSelector(selectCategoriesError)

  const refetch = () => {
    if (categoryId) {
      dispatch(fetchCategoryDetails(categoryId))
    }
  }

  useEffect(() => {
    if (categoryId && !details) {
      dispatch(fetchCategoryDetails(categoryId))
    }
  }, [dispatch, categoryId, details])

  return { details, loading, error, refetch }
} 