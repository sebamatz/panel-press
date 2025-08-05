/**
 * Utility function to process API data and extract items
 * Handles various data structures that might be returned from the API
 */
export function processApiData(apiData: any): any[] {
  console.log("Processing API data:", apiData)

  let processedItems: any[] = []

  // If apiData is an array, use it directly
  if (Array.isArray(apiData)) {
    processedItems = apiData.map((item, index) => ({
      id: item.sku || item.id || item.ID || index + 1,
      name: item.webName || item.name || item.Name || item.title || item.Title || `Product ${item.sku || index + 1}`,
      description: item.xdocname || item.description || item.Description || item.desc || "",
      code: item.sku || item.code || item.Code || "",
      ...item, // Include all other properties
    }))
  }

  // If apiData has an items property, use that
  if (apiData && apiData.items && Array.isArray(apiData.items)) {
    processedItems = apiData.items.map((item: any, index: number) => ({
      id: item.sku || item.id || item.ID || index + 1,
      name: item.webName || item.name || item.Name || item.title || item.Title || `Product ${item.sku || index + 1}`,
      description: item.xdocname || item.description || item.Description || item.desc || "",
      code: item.sku || item.code || item.Code || "",
      ...item, // Include all other properties
    }))
  }

  // If apiData has a data property, use that
  if (apiData && apiData.data && Array.isArray(apiData.data)) {
    processedItems = apiData.data.map((item: any, index: number) => ({
      id: item.sku || item.id || item.ID || index + 1,
      name: item.webName || item.name || item.Name || item.title || item.Title || `Product ${item.sku || index + 1}`,
      description: item.xdocname || item.description || item.Description || item.desc || "",
      code: item.sku || item.code || item.Code || "",
      ...item, // Include all other properties
    }))
  }

  // If apiData has a results property, use that
  if (apiData && apiData.results && Array.isArray(apiData.results)) {
    processedItems = apiData.results.map((item: any, index: number) => ({
      id: item.sku || item.id || item.ID || index + 1,
      name: item.webName || item.name || item.Name || item.title || item.Title || `Product ${item.sku || index + 1}`,
      description: item.xdocname || item.description || item.Description || item.desc || "",
      code: item.sku || item.code || item.Code || "",
      ...item, // Include all other properties
    }))
  }

  // If apiData is an object with properties, convert to array
  if (apiData && typeof apiData === "object") {
    // Check if it has numeric keys (like an object with array-like structure)
    const keys = Object.keys(apiData)
    const numericKeys = keys.filter((key) => !isNaN(Number(key)) && key !== "id" && key !== "name" && key !== "description")

    if (numericKeys.length > 0) {
      processedItems = numericKeys.map((key) => {
        const item = apiData[key]
        return {
          id: item.sku || item.id || item.ID || key,
          name: item.webName || item.name || item.Name || item.title || item.Title || `Product ${item.sku || key}`,
          description: item.xdocname || item.description || item.Description || item.desc || "",
          code: item.sku || item.code || item.Code || "",
          ...item, // Include all other properties
        }
      })
    } else {
      // Otherwise, treat the object itself as a single item
      processedItems = [{
        id: apiData.sku || apiData.id || apiData.ID || 1,
        name: apiData.webName || apiData.name || apiData.Name || apiData.title || apiData.Title || "Product",
        description: apiData.xdocname || apiData.description || apiData.Description || apiData.desc || "",
        code: apiData.sku || apiData.code || apiData.Code || "",
        ...apiData, // Include all other properties
      }]
    }
  }

  console.log("Processed items:", processedItems)
  return processedItems
}

/**
 * Extract category name from API data
 */
export function extractCategoryName(details: any, categoryId: string): string {
  return details?.name || details?.title || `Κατηγορία ${categoryId}`
} 