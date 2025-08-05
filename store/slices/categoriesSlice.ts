import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import { handleAPIError, handleSuccess } from '@/lib/toast'
import { processApiData } from '@/components/category/CategoryDataProcessor'

// API configuration
const API_BASE_URL = "https://www.alfaeorders.com:19443/erpapi"

// Types
export interface CategoryItem {
  id: string | number
  name: string
  description?: string
  parentId?: string
  level?: number
  [key: string]: any
}

export interface CategoryDetails {
  id: string | number
  name: string
  description?: string
  items?: any[]
  specifications?: any[]
  images?: string[]
  [key: string]: any
}

interface CategoriesState {
  items: CategoryItem[]
  details: Record<string | number, CategoryDetails>
  loading: boolean
  error: string | null
  lastFetched: number | null
}

const initialState: CategoriesState = {
  items: [],
  details: {},
  loading: false,
  error: null,
  lastFetched: null,
}

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = "/getitems/obj"
      const payload = {
        Company: 20,
        BOption: 70,
      }

      const url = `${API_BASE_URL}${endpoint}?pars=${encodeURIComponent(JSON.stringify(payload))}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const errorMsg = `HTTP error! status: ${response.status}`
        throw new Error(errorMsg)
      }

      const data = await response.json()

      // Process the API response to extract categories
      let categories: CategoryItem[] = []

      if (Array.isArray(data)) {
        categories = data.map((item, index) => ({
          id: item.id || item.ID || item.Id || index + 1,
          name: item.name || item.Name || item.title || item.Title || `Category ${index + 1}`,
          description: item.description || item.Description || item.desc || "",
          ...item,
        }))
      } else if (data && typeof data === "object") {
        // If it's an object, check for common array properties
        const possibleArrays = ["items", "data", "results", "categories"]
        let foundArray = null

        for (const prop of possibleArrays) {
          if (data[prop] && Array.isArray(data[prop])) {
            foundArray = data[prop]
            break
          }
        }

        if (foundArray) {
          categories = foundArray.map((item: any, index: number) => ({
            id: item.id || item.ID || item.Id || index + 1,
            name: item.name || item.Name || item.title || item.Title || `Category ${index + 1}`,
            description: item.description || item.Description || item.desc || "",
            ...item,
          }))
        } else {
          // If it's a single object, treat it as one category
          categories = [
            {
              id: data.id || data.ID || data.Id || 1,
              name: data.name || data.Name || data.title || data.Title || "Category 1",
              description: data.description || data.Description || data.desc || "",
              ...data,
            },
          ]
        }
      }

      // Show success toast
      handleSuccess(`Successfully loaded ${categories.length} categories`, 'Categories Loaded')
      
      return categories
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      
      // Show error toast
      handleAPIError(error, '/getitems/obj')
      
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchCategoryDetails = createAsyncThunk(
  'categories/fetchCategoryDetails',
  async (categoryId: string | number, { rejectWithValue }) => {
    try {
      const endpoint = "/getitems/obj"
      const payload = {
        Company: 20,
        BOption: 70,
        id: categoryId,
      }

      const url = `${API_BASE_URL}${endpoint}?pars=${encodeURIComponent(JSON.stringify(payload))}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const errorMsg = `HTTP error! status: ${response.status}`
        throw new Error(errorMsg)
      }

      const data = await response.json()
      console.log('Raw API response for category details:', data)

      // Enhanced data processing logic
      let items: any[] = []
      
      // Try multiple possible item array locations
      const possibleItemArrays = [
        data.items, data.Items, data.data, data.Data, data.products, data.Products,
        data.subitems, data.SubItems, data.children, data.Children,
        data.list, data.List, data.array, data.Array
      ]
      
      for (const itemArray of possibleItemArrays) {
        if (Array.isArray(itemArray) && itemArray.length > 0) {
          items = itemArray
          console.log('Found items array:', items)
          break
        }
      }
      
      // If no items array found, check if the data itself is an array
      if (items.length === 0 && Array.isArray(data)) {
        items = data
        console.log('Data is an array, using as items:', items)
      }
      
      // If still no items, check if data has a single item structure
      if (items.length === 0 && data && typeof data === 'object' && !Array.isArray(data)) {
        // Check if the object itself represents a single item
        if (data.id || data.ID || data.name || data.Name) {
          items = [data]
          console.log('Treating data as single item:', items)
        }
      }

      // Process the response
      const details: CategoryDetails = {
        id: categoryId,
        name: data.name || data.Name || data.title || data.Title || `Category ${categoryId}`,
        description: data.description || data.Description || data.desc || "",
        items: processApiData(items),
        ...data,
      }

      // Additional debugging
      console.log('Processed category details:', {
        id: categoryId,
        name: details.name,
        itemsCount: details.items?.length || 0,
        hasItems: !!details.items,
        itemsType: Array.isArray(details.items) ? 'array' : typeof details.items
      })

      return { id: categoryId, details }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      
      return rejectWithValue(errorMessage)
    }
  }
)

// Slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCategories: (state) => {
      state.items = []
      state.details = {}
      state.error = null
      state.lastFetched = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryItem[]>) => {
        state.loading = false
        state.items = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to fetch categories'
      })
      // fetchCategoryDetails
      .addCase(fetchCategoryDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategoryDetails.fulfilled, (state, action: PayloadAction<{ id: string | number, details: CategoryDetails }>) => {
        state.loading = false
        state.details[action.payload.id] = action.payload.details
      })
      .addCase(fetchCategoryDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to fetch category details'
      })
  },
})

export const { clearError, clearCategories } = categoriesSlice.actions
export default categoriesSlice.reducer 