# Redux Toolkit Setup

This project now uses Redux Toolkit for state management and data fetching, replacing the previous custom API hooks.

## Structure

```
store/
├── index.ts              # Main store configuration
├── provider.tsx          # Redux Provider component
├── hooks.ts              # Typed hooks for useDispatch and useSelector
├── selectors.ts          # Memoized selectors for efficient state access
└── slices/
    └── categoriesSlice.ts # Categories state management
```

## Key Features

### 1. **Redux Toolkit Integration**
- Uses `@reduxjs/toolkit` for simplified Redux setup
- Includes Redux DevTools for development debugging
- TypeScript support with proper typing

### 2. **Async Data Fetching**
- `createAsyncThunk` for handling API calls
- Automatic loading states
- Error handling with proper logging
- Caching with timestamp-based invalidation

### 3. **Performance Optimizations**
- Memoized selectors using `createSelector`
- Efficient re-renders with proper state subscriptions
- Automatic data caching and re-fetching logic

### 4. **Developer Experience**
- Redux DevTools integration
- Debug component for development
- Type-safe hooks and selectors

## Usage

### Basic Hook Usage

```typescript
import { useBaseCategories, useCategoryDetails } from '@/lib/redux-hooks'

// Fetch all categories
const { categories, loading, error, refetch } = useBaseCategories()

// Fetch specific category details
const { details, loading, error, refetch } = useCategoryDetails(categoryId)
```

### Direct Redux Usage

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchCategories } from '@/store/slices/categoriesSlice'
import { selectCategories } from '@/store/selectors'

const dispatch = useAppDispatch()
const categories = useAppSelector(selectCategories)

// Manually trigger fetch
dispatch(fetchCategories())
```

### Selectors

```typescript
import { 
  selectCategories,
  selectCategoriesCount,
  selectCategoryById,
  selectCategoriesByType 
} from '@/store/selectors'

// Get all categories
const categories = useAppSelector(selectCategories)

// Get count
const count = useAppSelector(selectCategoriesCount)

// Get specific category
const category = useAppSelector(state => selectCategoryById(state, id))

// Get filtered categories
const panelCategories = useAppSelector(state => selectCategoriesByType(state, 'panel'))
```

## State Structure

```typescript
interface CategoriesState {
  items: CategoryItem[]           // All categories
  details: Record<string | number, CategoryDetails>  // Cached category details
  loading: boolean               // Loading state
  error: string | null           // Error state
  lastFetched: number | null     // Timestamp of last fetch
}
```

## API Integration

The Redux store integrates with the existing API endpoints:
- `getBaseCategories()` - Fetches all categories
- `getCategoryDetails(categoryId)` - Fetches specific category details

All API calls include:
- Automatic logging via notification system
- Error handling and user feedback
- Caching to prevent unnecessary requests

## Migration from Old API

The old API hooks have been replaced:

| Old Hook | New Hook | Location |
|----------|----------|----------|
| `useBaseCategories()` | `useBaseCategories()` | `@/lib/redux-hooks` |
| `useCategoryDetails()` | `useCategoryDetails()` | `@/lib/redux-hooks` |

The new hooks maintain the same interface, so components don't need to be changed.

## Development Tools

### Redux DevTools
- Available in development mode
- Access via browser extension
- Shows state changes, actions, and timing

### Debug Component
- Shows real-time state information
- Only visible in development
- Displays categories count, loading state, and errors

## Benefits

1. **Centralized State Management** - All data in one place
2. **Performance** - Memoized selectors and efficient updates
3. **Developer Experience** - DevTools and debugging tools
4. **Type Safety** - Full TypeScript support
5. **Caching** - Automatic data caching and invalidation
6. **Error Handling** - Consistent error management
7. **Scalability** - Easy to add new slices and features 