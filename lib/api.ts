"use client"

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// API configuration
const API_BASE_URL = "https://www.alfaeorders.com:19443/erpapi"

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

export interface ProductDetails {
  id: string | number
  name: string
  description?: string
  specifications?: any[]
  images?: string[]
  price?: number
  code?: string
  category?: string
  [key: string]: any
}

// Create the API service
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }),
  tagTypes: ['Categories', 'CategoryDetails', 'Products'],
  endpoints: (builder) => ({
    // Get base categories
    getBaseCategories: builder.query<CategoryItem[], void>({
      query: () => {
        const payload = {
          Company: 20,
          BOption: 70,
        }
        return {
          url: `/getitems/obj?pars=${encodeURIComponent(JSON.stringify(payload))}`,
          method: 'GET',
        }
      },
      transformResponse: (data: any) => {
        console.log("Base categories response:", data)
        
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

        return categories
      },
      providesTags: ['Categories'],
    }),

    // Get category details
    getCategoryDetails: builder.query<CategoryDetails, string | number>({
      query: (categoryId) => {
        const payload = {
          Company: 20,
          BOption: 70,
          id: categoryId,
        }
        return {
          url: `/getitems/obj?pars=${encodeURIComponent(JSON.stringify(payload))}`,
          method: 'GET',
        }
      },
      transformResponse: (data: any, meta, categoryId) => {
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
          items: items,
          ...data,
        }

        return details
      },
      providesTags: (result, error, id) => [{ type: 'CategoryDetails', id }],
    }),

    // Get product details
    getProductDetails: builder.query<ProductDetails, { productId: string | number; categoryId?: string | number }>({
      query: ({ productId, categoryId = 1 }) => {
        const payload = {
          Company: 20,
          BOption: 70,
          id: categoryId,
          LastId: productId,
        }
        return {
          url: `/getitems/obj?pars=${encodeURIComponent(JSON.stringify(payload))}`,
          method: 'GET',
        }
      },
      transformResponse: (data: any, meta, { productId }) => {
        console.log("Product details response:", data)

        // Process the response
        const details: ProductDetails = {
          id: productId,
          name: data.name || data.Name || data.title || data.Title || `Product ${productId}`,
          description: data.description || data.Description || data.desc || "",
          specifications: data.specifications || data.Specifications || data.specs || [],
          images: data.images || data.Images || data.image || [],
          price: data.price || data.Price || data.cost || data.Cost,
          code: data.code || data.Code || data.productCode || data.ProductCode,
          category: data.category || data.Category || data.categoryName || data.CategoryName,
          ...data,
        }

        return details
      },
      providesTags: (result, error, { productId }) => [{ type: 'Products', id: productId }],
    }),
  }),
})

// Export hooks for use in components
export const {
  useGetBaseCategoriesQuery,
  useGetCategoryDetailsQuery,
  useGetProductDetailsQuery,
} = api
