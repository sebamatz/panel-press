"use client"

// API configuration and functions
const API_BASE_URL = "https://www.alfaeorders.com:19443/erpapi"

import { useState, useEffect } from "react"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface CategoryItem {
  id: string | number
  name: string
  description?: string
  parentId?: string
  level?: number
  [key: string]: any // For additional properties from the API
}

export interface CategoryDetails {
  id: string | number
  name: string
  description?: string
  items?: any[]
  specifications?: any[]
  images?: string[]
  [key: string]: any // For additional properties from the API
}

export async function getBaseCategories(): Promise<ApiResponse<CategoryItem[]>> {
  const endpoint = "/getitems/obj"
  const payload = {
    Company: 20,
    BOption: 70,
  }

  try {
    const url = `${API_BASE_URL}${endpoint}?pars=${encodeURIComponent(JSON.stringify(payload))}`

    console.log("Fetching base categories from:", url)

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
    console.log("Base categories response:", data)

    // Process the API response to extract categories
    let categories: CategoryItem[] = []

    if (Array.isArray(data)) {
      categories = data.map((item, index) => ({
        id: item.id || item.ID || item.Id || index + 1,
        name: item.name || item.Name || item.title || item.Title || `Category ${index + 1}`,
        description: item.description || item.Description || item.desc || "",
        ...item, // Include all other properties
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

    return {
      success: true,
      data: categories,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    
    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function getCategoryDetails(categoryId: string | number): Promise<ApiResponse<CategoryDetails>> {
  const endpoint = "/getitems/obj"
  const payload = {
    Company: 20,
    BOption: 70,
    id: categoryId,
  }

  try {
    const url = `${API_BASE_URL}${endpoint}?pars=${encodeURIComponent(JSON.stringify(payload))}`

    console.log("Fetching category details from:", url)

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
    console.log("Category details response:", data)

    // Process the response
    const details: CategoryDetails = {
      id: categoryId,
      name: data.name || data.Name || data.title || data.Title || `Category ${categoryId}`,
      description: data.description || data.Description || data.desc || "",
      items: data.items || data.Items || data.data || data.Data || [],
      ...data,
    }

    return {
      success: true,
      data: details,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    
    return {
      success: false,
      error: errorMessage,
    }
  }
}

export function useBaseCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await getBaseCategories()
      
      if (result.success && result.data) {
        setCategories(result.data)
      } else {
        setError(result.error || "Failed to fetch categories")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, loading, error, refetch: fetchCategories }
}

export function useCategoryDetails(categoryId: string | number | null) {
  const [details, setDetails] = useState<CategoryDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetails = async () => {
    if (!categoryId) return

    try {
      setLoading(true)
      setError(null)
      
      const result = await getCategoryDetails(categoryId)
      
      if (result.success && result.data) {
        setDetails(result.data)
      } else {
        setError(result.error || "Failed to fetch category details")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetails()
  }, [categoryId])

  return { details, loading, error, refetch: fetchDetails }
}
