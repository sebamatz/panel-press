import { configureStore } from '@reduxjs/toolkit'
import categoriesReducer from './slices/categoriesSlice'

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['categories/fetchCategories/pending', 'categories/fetchCategories/fulfilled', 'categories/fetchCategories/rejected'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['categories.lastFetched'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 