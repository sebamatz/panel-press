import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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

export interface ColumnSchema {
  id: string | number
  name: string
  type: string
  colType?: string
  header: string
  accessorKey: string
  required?: boolean
  editable?: boolean
  priority?: number
  baseCategory?: number
  series?: number
  options?: any[]
  rawValues?: string
  values?: string // JSON string containing column values/options
  columnId?: number
  field?: string
  title?: string
  [key: string]: any
}

interface ApiState {
  // Categories state
  categories: CategoryItem[]
  categoriesLoading: boolean
  categoriesError: string | null
  
  // Category details state
  categoryDetails: Record<string | number, CategoryDetails>
  categoryDetailsLoading: Record<string | number, boolean>
  categoryDetailsError: Record<string | number, string | null>
  
  // Product details state
  productDetails: Record<string, ProductDetails>
  productDetailsLoading: Record<string, boolean>
  productDetailsError: Record<string, string | null>
  
  // Column schema state
  columnSchemas: Record<string, ColumnSchema[]>
  columnSchemasLoading: Record<string, boolean>
  columnSchemasError: Record<string, string | null>
  
  // Product details list state
  productDetailsList: Record<string, any[]>
  productDetailsListLoading: Record<string, boolean>
  productDetailsListError: Record<string, string | null>
  
  // Actions
  fetchCategories: () => Promise<void>
  fetchCategoryDetails: (categoryId: string | number) => Promise<void>
  fetchProductDetails: (productId: string | number, categoryId?: string | number) => Promise<void>
  fetchColumnSchema: (baseCategory: string | number, series: string | number) => Promise<void>
  fetchProductDetailsList: (baseCategory: string | number, lastId: string | number, searchValue?: string) => Promise<void>
  clearErrors: () => void
}

// Helper function to process categories response
function processCategoriesResponse(data: any): CategoryItem[] {
  console.log("Base categories response:", data)
  
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
}

// Helper function to process category details response
function processCategoryDetailsResponse(data: any, categoryId: string | number): CategoryDetails {
  console.log('Raw API response for category details:', data)

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
}

// Helper function to process product details response
function processProductDetailsResponse(data: any, productId: string | number): ProductDetails {
  console.log("Product details response:", data)

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
}

// Helper function to process column schema response
function processColumnSchemaResponse(data: any): ColumnSchema[] {
  console.log("Column schema response:", data)
  
  let columns: ColumnSchema[] = []

  if (Array.isArray(data)) {
    columns = data.map((item: any) => {
      // Parse the values JSON string if it exists
      let parsedValues = []
      if (item.values && typeof item.values === 'string') {
        try {
          parsedValues = JSON.parse(item.values)
        } catch (e) {
          console.warn('Failed to parse values JSON:', item.values)
        }
      } else if (Array.isArray(item.values)) {
        parsedValues = item.values
      }

      return {
        id: item.columnId || item.id || item.ID || item.Id,
        name: item.field || item.name || item.Name || item.fieldName || item.FieldName,
        type: item.colType || item.type || item.Type || item.dataType || item.DataType || 'string',
        header: item.title || item.header || item.Header || item.displayName || item.DisplayName || item.field,
        accessorKey: item.field || item.accessorKey || item.AccessorKey || item.fieldName || item.FieldName,
        required: !item.editable || item.required || item.Required || false,
        editable: item.editable !== false,
        priority: item.priority || 0,
        baseCategory: item.baseCategory,
        series: item.series,
        options: parsedValues,
        rawValues: item.values,
        ...item,
      }
    })
  } else if (data && typeof data === "object") {
    // If it's an object, check for common array properties
    const possibleArrays = ["columns", "Columns", "fields", "Fields", "schema", "Schema", "data", "Data"]
    let foundArray = null

    for (const prop of possibleArrays) {
      if (data[prop] && Array.isArray(data[prop])) {
        foundArray = data[prop]
        break
      }
    }

    if (foundArray) {
      columns = foundArray.map((item: any) => {
        // Parse the values JSON string if it exists
        let parsedValues = []
        if (item.values && typeof item.values === 'string') {
          try {
            parsedValues = JSON.parse(item.values)
          } catch (e) {
            console.warn('Failed to parse values JSON:', item.values)
          }
        } else if (Array.isArray(item.values)) {
          parsedValues = item.values
        }

        return {
          id: item.columnId || item.id || item.ID || item.Id,
          name: item.field || item.name || item.Name || item.fieldName || item.FieldName,
          type: item.colType || item.type || item.Type || item.dataType || item.DataType || 'string',
          header: item.title || item.header || item.Header || item.displayName || item.DisplayName || item.field,
          accessorKey: item.field || item.accessorKey || item.AccessorKey || item.fieldName || item.FieldName,
          required: !item.editable || item.required || item.Required || false,
          editable: item.editable !== false,
          priority: item.priority || 0,
          baseCategory: item.baseCategory,
          series: item.series,
          options: parsedValues,
          rawValues: item.values,
          ...item,
        }
      })
    }
  }

  // Sort columns by priority if available
  columns.sort((a, b) => (a.priority || 0) - (b.priority || 0))

  return columns
}

// Helper function to process product details list response
function processProductDetailsListResponse(data: any): any[] {
  console.log("Product details list response:", data)
  
  let items: any[] = []

  if (Array.isArray(data)) {
    items = data.map((item: any) => ({
      SKU: item.SKU || item.sku || '',
      WebName: item.WebName || item.webName || item.WebName || '',
      XDOCNAME: item.XDOCNAME || item.xdocname || '',
      ...item
    }))
  } else if (data && typeof data === "object") {
    // If it's an object, check for common array properties
    const possibleArrays = ["items", "Items", "data", "Data", "products", "Products", "results", "Results"]
    let foundArray = null

    for (const prop of possibleArrays) {
      if (data[prop] && Array.isArray(data[prop])) {
        foundArray = data[prop]
        break
      }
    }

    if (foundArray) {
      items = foundArray.map((item: any) => ({
        SKU: item.SKU || item.sku || '',
        WebName: item.WebName || item.webName || item.WebName || '',
        XDOCNAME: item.XDOCNAME || item.xdocname || '',
        ...item
      }))
    }
  }

  return items
}

export const useApiStore = create<ApiState>()(
  devtools(
    (set, get) => ({
      // Initial state
      categories: [],
      categoriesLoading: false,
      categoriesError: null,
      
      categoryDetails: {},
      categoryDetailsLoading: {},
      categoryDetailsError: {},
      
      productDetails: {},
      productDetailsLoading: {},
      productDetailsError: {},
      
      columnSchemas: {},
      columnSchemasLoading: {},
      columnSchemasError: {},
      
      productDetailsList: {},
      productDetailsListLoading: {},
      productDetailsListError: {},
      
      // Actions
      fetchCategories: async () => {
        set({ categoriesLoading: true, categoriesError: null })
        
        try {
          const payload = {
            Company: 20,
            BOption: 70,
          }
          
          const url = `${API_BASE_URL}/getitems/obj?pars=${encodeURIComponent(JSON.stringify(payload))}`
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          const categories = processCategoriesResponse(data)
          
          set({ 
            categories, 
            categoriesLoading: false, 
            categoriesError: null 
          })
        } catch (error) {
          console.error('Error fetching categories:', error)
          set({ 
            categoriesLoading: false, 
            categoriesError: error instanceof Error ? error.message : 'Unknown error' 
          })
        }
      },
      
      fetchCategoryDetails: async (categoryId: string | number) => {
        set(state => ({
          categoryDetailsLoading: { ...state.categoryDetailsLoading, [categoryId]: true },
          categoryDetailsError: { ...state.categoryDetailsError, [categoryId]: null }
        }))
        
        try {
          const payload = {
            Company: 20,
            BOption: 70,
            id: categoryId,
          }
          
          const url = `${API_BASE_URL}/getitems/obj?pars=${encodeURIComponent(JSON.stringify(payload))}`
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          const details = processCategoryDetailsResponse(data, categoryId)
          
          set(state => ({
            categoryDetails: { ...state.categoryDetails, [categoryId]: details },
            categoryDetailsLoading: { ...state.categoryDetailsLoading, [categoryId]: false },
            categoryDetailsError: { ...state.categoryDetailsError, [categoryId]: null }
          }))
        } catch (error) {
          console.error('Error fetching category details:', error)
          set(state => ({
            categoryDetailsLoading: { ...state.categoryDetailsLoading, [categoryId]: false },
            categoryDetailsError: { ...state.categoryDetailsError, [categoryId]: error instanceof Error ? error.message : 'Unknown error' }
          }))
        }
      },
      
      fetchProductDetails: async (productId: string | number, categoryId: string | number = 1) => {
        const key = `${productId}-${categoryId}`
        
        set(state => ({
          productDetailsLoading: { ...state.productDetailsLoading, [key]: true },
          productDetailsError: { ...state.productDetailsError, [key]: null }
        }))
        
        try {
          const payload = {
            Company: 20,
            BOption: 70,
            id: categoryId,
            LastId: productId,
          }
          
          const url = `${API_BASE_URL}/getitems/obj?pars=${encodeURIComponent(JSON.stringify(payload))}`
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          const details = processProductDetailsResponse(data, productId)
          
          set(state => ({
            productDetails: { ...state.productDetails, [key]: details },
            productDetailsLoading: { ...state.productDetailsLoading, [key]: false },
            productDetailsError: { ...state.productDetailsError, [key]: null }
          }))
        } catch (error) {
          console.error('Error fetching product details:', error)
          set(state => ({
            productDetailsLoading: { ...state.productDetailsLoading, [key]: false },
            productDetailsError: { ...state.productDetailsError, [key]: error instanceof Error ? error.message : 'Unknown error' }
          }))
        }
      },
      
      fetchColumnSchema: async (baseCategory: string | number, series: string | number) => {
        const key = `${baseCategory}-${series}`
        
        set(state => ({
          columnSchemasLoading: { ...state.columnSchemasLoading, [key]: true },
          columnSchemasError: { ...state.columnSchemasError, [key]: null }
        }))
        
        try {
          const url = `${API_BASE_URL}/panel/schema/columns?BaseCategory=${baseCategory}&Series=${series}`
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          const columns = processColumnSchemaResponse(data)
          
          set(state => ({
            columnSchemas: { ...state.columnSchemas, [key]: columns },
            columnSchemasLoading: { ...state.columnSchemasLoading, [key]: false },
            columnSchemasError: { ...state.columnSchemasError, [key]: null }
          }))
        } catch (error) {
          console.error('Error fetching column schema:', error)
          set(state => ({
            columnSchemasLoading: { ...state.columnSchemasLoading, [key]: false },
            columnSchemasError: { ...state.columnSchemasError, [key]: error instanceof Error ? error.message : 'Unknown error' }
          }))
        }
      },
      
      fetchProductDetailsList: async (baseCategory: string | number, lastId: string | number, searchValue = "") => {
        const key = `${baseCategory}-${lastId}-${searchValue}`
        
        set(state => ({
          productDetailsListLoading: { ...state.productDetailsListLoading, [key]: true },
          productDetailsListError: { ...state.productDetailsListError, [key]: null }
        }))
        
        try {
          const payload = {
            Company: 20,
            BOption: 70,
            id: baseCategory,
            LastId: lastId,
            SearchValue: searchValue
          }
          
          // URL encode the parameters
          const encodedParams = encodeURIComponent(JSON.stringify(payload))
          const url = `${API_BASE_URL}/getitems/obj?pars=${encodedParams}`
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          const productDetails = processProductDetailsListResponse(data)
          
          set(state => ({
            productDetailsList: { ...state.productDetailsList, [key]: productDetails },
            productDetailsListLoading: { ...state.productDetailsListLoading, [key]: false },
            productDetailsListError: { ...state.productDetailsListError, [key]: null }
          }))
        } catch (error) {
          console.error('Error fetching product details list:', error)
          set(state => ({
            productDetailsListLoading: { ...state.productDetailsListLoading, [key]: false },
            productDetailsListError: { ...state.productDetailsListError, [key]: error instanceof Error ? error.message : 'Unknown error' }
          }))
        }
      },
      
      clearErrors: () => {
        set({
          categoriesError: null,
          categoryDetailsError: {},
          productDetailsError: {},
          columnSchemasError: {},
          productDetailsListError: {}
        })
      }
    }),
    {
      name: 'api-store',
    }
  )
)
