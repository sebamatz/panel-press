# RTK Query Setup

This document describes the RTK Query implementation in the Panel Press Portal application.

## Overview

RTK Query is a powerful data fetching and caching library that's part of Redux Toolkit. It provides:

- **Automatic Caching**: Data is cached and shared across components
- **Automatic Re-fetching**: Data is automatically re-fetched when needed
- **Loading States**: Built-in loading, error, and success states
- **Optimistic Updates**: Support for optimistic updates
- **TypeScript Support**: Full TypeScript support with type safety

## File Structure

```
lib/
├── api.ts                    # RTK Query API service with endpoints
store/
├── index.ts                  # Redux store configuration
├── hooks.ts                  # Typed Redux hooks
└── provider.tsx              # Redux provider component
components/
└── RTKQueryDebug.tsx         # Debug component to showcase RTK Query features
```

## API Endpoints

### 1. getBaseCategories
- **Purpose**: Fetches all base categories
- **Hook**: `useGetBaseCategoriesQuery()`
- **Returns**: `CategoryItem[]`
- **Cache Tags**: `['Categories']`

### 2. getCategoryDetails
- **Purpose**: Fetches details for a specific category
- **Hook**: `useGetCategoryDetailsQuery(categoryId)`
- **Returns**: `CategoryDetails`
- **Cache Tags**: `[{ type: 'CategoryDetails', id }]`

### 3. getProductDetails
- **Purpose**: Fetches details for a specific product
- **Hook**: `useGetProductDetailsQuery({ productId, categoryId })`
- **Returns**: `ProductDetails`
- **Cache Tags**: `[{ type: 'Products', id: productId }]`

## Usage Examples

### Basic Query Hook
```tsx
import { useGetBaseCategoriesQuery } from '@/lib/api'

function MyComponent() {
  const { data: categories = [], isLoading, error, refetch } = useGetBaseCategoriesQuery()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>{category.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

### Conditional Query
```tsx
import { useGetCategoryDetailsQuery } from '@/lib/api'

function CategoryDetails({ categoryId }: { categoryId: string }) {
  const { data: details, isLoading } = useGetCategoryDetailsQuery(categoryId, {
    skip: !categoryId // Skip query if no categoryId
  })
  
  if (isLoading) return <div>Loading...</div>
  
  return <div>{details?.name}</div>
}
```

### Polling
```tsx
const { data } = useGetBaseCategoriesQuery(undefined, {
  pollingInterval: 30000, // Refetch every 30 seconds
})
```

## Benefits

### 1. Automatic Caching
- Data is automatically cached and shared across components
- No need to manually manage cache invalidation
- Cache is automatically updated when data changes

### 2. Loading States
- Built-in `isLoading`, `isFetching`, `isSuccess`, `isError` states
- Automatic loading indicators
- Optimistic updates support

### 3. Performance
- Deduplication of requests
- Background refetching
- Cache normalization

### 4. Developer Experience
- TypeScript support
- DevTools integration
- Automatic error handling

## Migration from Custom Hooks

The application was migrated from custom React hooks to RTK Query:

### Before (Custom Hooks)
```tsx
// lib/api.ts
export function useBaseCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // Manual fetch logic
  }, [])
  
  return { categories, loading, error, refetch }
}
```

### After (RTK Query)
```tsx
// lib/api.ts
export const api = createApi({
  // ... configuration
  endpoints: (builder) => ({
    getBaseCategories: builder.query({
      query: () => ({ url: '/endpoint' }),
      transformResponse: (data) => data,
    }),
  }),
})

// In components
const { data: categories, isLoading, error, refetch } = useGetBaseCategoriesQuery()
```

## Debug Component

The `RTKQueryDebug` component shows:
- Query status (loading, fetching, success, error)
- Cache information
- Data availability
- Manual refetch capability

This helps developers understand how RTK Query is working in the application.

## Next Steps

1. **Add Mutations**: For creating, updating, and deleting data
2. **Cache Invalidation**: Implement cache invalidation strategies
3. **Optimistic Updates**: Add optimistic updates for better UX
4. **Error Handling**: Implement global error handling
5. **Pagination**: Add pagination support for large datasets 