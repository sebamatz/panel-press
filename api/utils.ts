import { CategoryDetails, CategoryItem, IBOption } from "./types";

  

export enum bOption {
  getBaseCategories = 70,
  getBaseCategoriesProductColumns = 71,
  getColorCompanies = 60,
  getColorTypes = 30,
  getColorManufacturers = 40,
  getColors = 50,
  getPrice = 80,
}

// Helper function to process categories response
export function processCategoriesResponse(data: any): CategoryItem[] {
    console.log("Base categories response:", data);
  
    let categories: CategoryItem[] = [];
  
    if (Array.isArray(data)) {
      categories = data.map((item, index) => ({
        id: item.id || item.ID || item.Id || index + 1,
        name:
          item.name ||
          item.Name ||
          item.title ||
          item.Title ||
          `Category ${index + 1}`,
        description: item.description || item.Description || item.desc || "",
        ...item,
      }));
    } else if (data && typeof data === "object") {
      // If it's an object, check for common array properties
      const possibleArrays = ["items", "data", "results", "categories"];
      let foundArray = null;
  
      for (const prop of possibleArrays) {
        if (data[prop] && Array.isArray(data[prop])) {
          foundArray = data[prop];
          break;
        }
      }
  
      if (foundArray) {
        categories = foundArray.map((item: any, index: number) => ({
          id: item.id || item.ID || item.Id || index + 1,
          name:
            item.name ||
            item.Name ||
            item.title ||
            item.Title ||
            `Category ${index + 1}`,
          description: item.description || item.Description || item.desc || "",
          ...item,
        }));
      } else {
        // If it's a single object, treat it as one category
        categories = [
          {
            id: data.id || data.ID || data.Id || 1,
            name:
              data.name || data.Name || data.title || data.Title || "Category 1",
            description: data.description || data.Description || data.desc || "",
            ...data,
          },
        ];
      }
    }
  
    return categories;
  }
  
  // Helper function to process category details response
 export function processCategoryDetailsResponse(
    data: any,
    categoryId: string | number
  ): CategoryDetails {
    console.log("Raw API response for category details:", data);
  
    let items: any[] = [];
  
    // Try multiple possible item array locations
    const possibleItemArrays = [
      data.items,
      data.Items,
      data.data,
      data.Data,
      data.products,
      data.Products,
      data.subitems,
      data.SubItems,
      data.children,
      data.Children,
      data.list,
      data.List,
      data.array,
      data.Array,
    ];
  
    for (const itemArray of possibleItemArrays) {
      if (Array.isArray(itemArray) && itemArray.length > 0) {
        items = itemArray;
        console.log("Found items array:", items);
        break;
      }
    }
  
    // If no items array found, check if the data itself is an array
    if (items.length === 0 && Array.isArray(data)) {
      items = data;
      console.log("Data is an array, using as items:", items);
    }
  
    // If still no items, check if data has a single item structure
    if (
      items.length === 0 &&
      data &&
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      // Check if the object itself represents a single item
      if (data.id || data.ID || data.name || data.Name) {
        items = [data];
        console.log("Treating data as single item:", items);
      }
    }
  
    // Process the response
    const details: CategoryDetails = {
      id: categoryId,
      name:
        data.name ||
        data.Name ||
        data.title ||
        data.Title ||
        `Category ${categoryId}`,
      description: data.description || data.Description || data.desc || "",
      items: items,
      ...data,
    };
  
    return details;
  }
  