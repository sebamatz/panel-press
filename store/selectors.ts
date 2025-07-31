import { createSelector } from '@reduxjs/toolkit'
import { RootState } from './index'

// Basic selectors
export const selectCategories = (state: RootState) => state.categories.items
export const selectCategoryDetails = (state: RootState) => state.categories.details
export const selectCategoriesLoading = (state: RootState) => state.categories.loading
export const selectCategoriesError = (state: RootState) => state.categories.error
export const selectLastFetched = (state: RootState) => state.categories.lastFetched

// Memoized selectors
export const selectCategoriesCount = createSelector(
  [selectCategories],
  (categories) => categories.length
)

export const selectCategoryById = createSelector(
  [selectCategoryDetails, (_state: RootState, id: string | number) => id],
  (details, id) => details[id] || null
)

export const selectCategoriesWithDetails = createSelector(
  [selectCategories, selectCategoryDetails],
  (categories, details) => 
    categories.map(category => ({
      ...category,
      details: details[category.id] || null
    }))
)

export const selectCategoriesByType = createSelector(
  [selectCategories, (_state: RootState, type: string) => type],
  (categories, type) => 
    categories.filter(category => 
      category.name?.toLowerCase().includes(type.toLowerCase())
    )
) 