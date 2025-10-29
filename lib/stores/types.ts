export interface ColorSelectionItem {
  selectedTrdpgroup: number | null;
  manifacturer?: ColorManufacturer[];
  colorType: string;
  colorManufacturerValue?: {
    ccCPOUDRAID: string;
    sky: string;
  };
  selectedColorCompany?: number | null;
  colorValue: string;
  selectedManifacturer: string;
  colorData: IColorData[];
}

export interface IColorData {
  ccCPOUDRAID: number;
  sku: string;
}

export interface ColorType {
  id: number;
  name: string;
}

export interface ColorCompany {
  id: number;
  code: string;
  name: string;
  trdpgroup: number;
}

export interface Manufacturer {
  id: number;
  code: string;
  name: string;
}

export interface ColorSelectionState {
  // Shared State
  colorCompanies: ColorCompany[];
  profilColors: string;
  colorTypes: ColorType[];

  // Unified selection items (one for COLOR, two for DUAL_COLOR)
  colorSelectionState: ColorSelectionItem[];

  // Primary Color State (for single color or first color in dual)
  primarySelectedTrdpgroup: number | null;
  primaryManifacturer: Manufacturer[];
  primaryColorType: string;
  primarySelectedColorCompany: number | null;
  primaryColorValue: string;
  primarySelectedManifacturer: string;
  primaryColorData: IColorData[];
  primaryColorManifacturerValue: string;

  // Secondary Color State (for second color in dual)
  secondarySelectedTrdpgroup: number | null;
  secondaryManifacturer: Manufacturer[];
  secondaryColorType: string;
  secondarySelectedColorCompany: number | null;
  secondaryColorValue: string;
  secondarySelectedManifacturer: string;
  secondaryColorData: IColorData[];
  secondaryColorManifacturerValue: string;

  // Actions
  setProfilColors: (profilColors: string) => void;
  setColorCompanies: (colorCompanies: ColorCompany[]) => void;
  setColorTypes: (colorTypes: ColorType[]) => void;
  setColorSelectionState: (colorSelectionState: ColorSelectionItem[]) => void;

  // Primary color actions
  setPrimarySelectedTrdpgroup: (
    selectedTrdpgroup: number | null,
    isSecondary?: boolean
  ) => void;
  setPrimaryManifacturer: (manifacturer: Manufacturer[]) => void;
  setPrimaryColorType: (colorType: string) => void;
  setPrimarySelectedColorCompany: (selectedColorCompany: number | null) => void;
  setPrimaryColorValue: (colorValue: string) => void;
  setPrimarySelectedManifacturer: (selectedManifacturer: string) => void;
  setPrimaryColorData: (colorData: IColorData[]) => void;
  setPrimaryColorManifacturerValue: (colorManifacturerValue: string) => void;

  // Secondary color actions
  setSecondarySelectedTrdpgroup: (selectedTrdpgroup: number | null) => void;
  setSecondaryManifacturer: (manifacturer: Manufacturer[]) => void;
  setSecondaryColorType: (colorType: string) => void;
  setSecondarySelectedColorCompany: (
    selectedColorCompany: number | null
  ) => void;
  setSecondaryColorValue: (colorValue: string) => void;
  setSecondarySelectedManifacturer: (selectedManifacturer: string) => void;
  setSecondaryColorData: (colorData: IColorData[]) => void;
  setSecondaryColorManifacturerValue: (colorManifacturerValue: string) => void;

  // API Actions
  fetchColorTypes: () => Promise<void>;
  fetchManufacturers: (isSecondary?: boolean) => Promise<void>;
  fetchColorCompanies: () => Promise<void>;
  fetchColors: (
    params: {
      colorType: string;
      selectedManifacturer: string;
      colorValue: string;
    },
    isSecondary?: boolean
  ) => Promise<void>;

  // Reset actions
  resetPrimaryColorType: () => void;
  resetPrimaryManufacturer: () => void;
  resetPrimaryColorValue: () => void;
  resetPrimaryColorData: () => void;
  resetSecondaryColorType: () => void;
  resetSecondaryManufacturer: () => void;
  resetSecondaryColorValue: () => void;
  resetSecondaryColorData: () => void;
  resetAll: () => void;
}

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