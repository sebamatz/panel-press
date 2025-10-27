import { ColorSelectionItem } from "./colorSelectionStore";

export interface ApiState {
    // Categories state (base categories)
    categories: CategoryItem[];
    categoriesLoading: boolean;
    categoriesError: string | null;
  
    // Category details state
    categoryDetails: Record<string | number, CategoryDetails>;
    categoryDetailsLoading: Record<string | number, boolean>;
    categoryDetailsError: Record<string | number, string | null>;
    selectedCategoryDetails: string | number | null;
    setSelectedCategoryDetails: (
      selectedCategoryDetails: string | number | null
    ) => void;
    // Product details state
    productDetails: Record<string, ProductDetails>;
    productDetailsLoading: Record<string, boolean>;
    productDetailsError: Record<string, string | null>;
  
    // Column schema state
    columnSchemas: ColumnSchema[];
  
    columnSchemasLoading: Record<string, boolean>;
    columnSchemasError: Record<string, string | null>;
  
    // Product details list state
    productDetailsList: Record<string, any[]>;
    productDetailsListLoading: Record<string, boolean>;
    productDetailsListError: Record<string, string | null>;

    // Color state
    colorSelectionState: ColorSelectionItem[];
  
    // Actions
    fetchCategories: () => Promise<void>;
    fetchCategoryDetails: (categoryId: string | number) => Promise<void>;
    fetchProductDetails: (
      productId: string | number,
      categoryId?: string | number
    ) => Promise<void>;
    fetchColumnSchema: (
      baseCategory: string | number,
      series: string | number
    ) => Promise<void>;
    clearErrors: () => void;
  }

export interface CategoryItem {
    id: string | number;
    name: string;
    description?: string;
    parentId?: string;
    level?: number;
    [key: string]: any;
  }
  
  export interface CategoryDetails {
    id: string | number;
    name: string;
    description?: string;
    items?: any[];
    specifications?: any[];
    images?: string[];
    [key: string]: any;
  }
  
  export interface ProductDetails {
    id: string | number;
    name: string;
    description?: string;
    specifications?: any[];
    images?: string[];
    price?: number;
    code?: string;
    category?: string;
    [key: string]: any;
  }
  
  export interface ColumnSchema {
    baseCategory: number;
    colType: string;
    columnId: number;
    editable: boolean;
    field: string;
    priority: number;
    series: number;
    title: string;
    values: any;
    [key: string]: any;
  }
  

  export interface ColorManufacturer {
    id: number;
    code: string;
  }

  export interface ColorType {
    id: number;
    name: string;
  } 