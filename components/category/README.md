# Category Components

This directory contains optimized, reusable components for the category details page functionality.

## Components

### `CategoryDetailsHeader`
Displays the header section with back button, category name, and ID badge.

**Props:**
- `categoryId: string` - The category ID
- `categoryName: string` - The display name for the category
- `onBack: () => void` - Callback for the back button

### `CategoryLoadingState`
Shows the loading state with spinner and API call information.

**Props:**
- `categoryId: string` - The category ID
- `onBack: () => void` - Callback for the back button

### `CategoryErrorState`
Displays error information when API calls fail.

**Props:**
- `categoryId: string` - The category ID
- `error: string` - The error message
- `onBack: () => void` - Callback for the back button

### `CategoryProductSelector`
Handles product selection with combobox and selected item display. **Self-contained component that manages its own state.**

**Props:**
- `products: ComboboxItem[]` - Array of products to display

### `CategoryEmptyState`
Shows when no items are found in the category.

**Props:** None

### `CategoryDebugInfo`
Development-only component that displays debug information.

**Props:**
- `categoryId: string` - The category ID
- `details: any` - Raw API response data
- `apiItems: any[]` - Processed items array

## Utilities

### `processApiData(apiData: any): any[]`
Utility function that handles various API response structures and extracts items.

### `extractCategoryName(details: any, categoryId: string): string`
Extracts the category name from API data with fallback.

## Usage

```tsx
import {
  CategoryDetailsHeader,
  CategoryLoadingState,
  CategoryErrorState,
  CategoryProductSelector,
  CategoryEmptyState,
  CategoryDebugInfo,
  processApiData,
  extractCategoryName
} from "@/components/category"

// Use in your component
<CategoryDetailsHeader
  categoryId="123"
  categoryName="My Category"
  onBack={() => router.push("/")}
/>

// Product selector is now self-contained
<CategoryProductSelector products={products} />
```

## Benefits

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be used in other parts of the application
3. **Maintainability**: Easier to update and debug individual components
4. **Testability**: Each component can be tested in isolation
5. **Type Safety**: Proper TypeScript interfaces for all props
6. **Performance**: Smaller, focused components are more efficient
7. **State Management**: Components manage their own internal state when appropriate
8. **Page Optimization**: Main page component is now stateless and focused on rendering 