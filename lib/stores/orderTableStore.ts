import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { submitOrders } from '@/api/fetch'
import { companySettings } from '@/config'

export interface OrderRow {
  [key: string]: any
  product?: any
  color?: string
  dimension?: any
  gemisi?: any
  lamarina?: any
}

interface OrderTableState {
  // Order data
  orders: OrderRow[]
  
  // UI state
  isAdding: boolean
  editingIndex: number | null
  draftRow: OrderRow
  newRow: OrderRow
  
  // API state
  isSubmitting: boolean
  submitError: string | null
  
  // Actions
  addOrder: (order: OrderRow) => void
  updateOrder: (index: number, order: OrderRow) => void
  deleteOrder: (index: number) => void
  
  // UI actions
  setIsAdding: (isAdding: boolean) => void
  setEditingIndex: (index: number | null) => void
  setDraftRow: (data: OrderRow) => void
  setNewRow: (data: OrderRow) => void
  updateNewRowField: (field: string, value: any) => void
  updateDraftRowField: (field: string, value: any) => void
  updateAllRowsField: (field: string, value: any) => void
  // Edit actions
  saveEdit: () => void
  cancelEdit: () => void
  
  // API actions
  submitOrders: () => Promise<void>
  clearOrders: () => void
  resetUI: () => void
}

export const useOrderTableStore = create<OrderTableState>()(
  devtools(
    (set, get) => ({
      // Initial state
      orders: [],
      isAdding: false,
      editingIndex: null,
      draftRow: {},
      newRow: {},
      isSubmitting: false,
      submitError: null,

      // Order CRUD actions
      addOrder: (order) => {
        set((state) => ({
          orders: [...state.orders, order]
        }))
      },

      updateOrder: (index, order) => {
        set((state) => ({
          orders: state.orders.map((item, i) => (i === index ? order : item))
        }))
      },

      deleteOrder: (index) => {
        set((state) => ({
          orders: state.orders.filter((_, i) => i !== index),
          editingIndex: state.editingIndex === index ? null : 
                       state.editingIndex && state.editingIndex > index ? 
                       state.editingIndex - 1 : state.editingIndex
        }))
      },

      // UI state actions
      setIsAdding: (isAdding) => set({ isAdding }),
      
      setEditingIndex: (editingIndex) => set({ editingIndex }),
      
      setDraftRow: (draftRow) => set({ draftRow }),
      
      setNewRow: (newRow) => set({ newRow }),
      
      updateNewRowField: (field, value) => {
        set((state) => ({
          newRow: { ...state.newRow, [field]: value }
        }))
      },
      updateDraftRowField: (field, value) => {
        set((state) => ({
          draftRow: { ...state.draftRow, [field]: value }
        }))
      },
      updateAllRowsField: (field: string, value: any) => {
        set((state) => ({
          orders: state.orders.map((order) => ({ ...order, [field]: value }))
        }));
      },

      // Edit actions
      saveEdit: () => {
        const state = get()
        if (state.editingIndex !== null) {
          state.updateOrder(state.editingIndex, state.draftRow)
          state.resetUI()
        }
      },

      cancelEdit: () => {
        set({
          editingIndex: null,
          draftRow: {}
        })
      },

      // API actions
      submitOrders: async () => {
        const state = get()
        if (state.orders.length === 0) {
          set({ submitError: 'No orders to submit' })
          return
        }

        set({ isSubmitting: true, submitError: null })

        try {
          // Transform orders to API format
          const apiOrders = state.orders.map(order => ({
            Company: companySettings.company,
            bOption: 0,
            trdr: 3975, // Default trader ID - should be dynamic
            trdbranch: 125, // Default branch ID - should be dynamic
            comments: order.comments || '',
            mtrl: order.product?.SKU || order.product?.sku || 10069, // Product SKU or default
            commentS1: order.color || '',
            qtY1: order.quantity1 || 0,
            qtY2: order.quantity2 || 0,
            // Add other fields as needed
            ...order
          }))

          const response = await submitOrders(apiOrders)
          
          if (response.response.ok) {
            // Clear orders on successful submission
            state.clearOrders()
            set({ isSubmitting: false, submitError: null })
          } else {
            throw new Error('Failed to submit orders')
          }
        } catch (error) {
          console.error('Error submitting orders:', error)
          set({ 
            isSubmitting: false, 
            submitError: error instanceof Error ? error.message : 'Failed to submit orders' 
          })
        }
      },

      clearOrders: () => {
        set({ orders: [] })
      },

      resetUI: () => {
        set({
          isAdding: false,
          editingIndex: null,
          draftRow: {},
          newRow: {}
        })
      }
    }),
    {
      name: 'order-table-store'
    }
  )
)

// Helper function to normalize row data for saving
function normalizeRowForSave(row: OrderRow): OrderRow {
  const normalized: OrderRow = { ...row }
  
  Object.keys(normalized).forEach((key) => {
    const fieldLower = key.toString().toLowerCase()
    const value = normalized[key]
    
    if ((fieldLower === "gemisi" || fieldLower === "lamarina") && value != null) {
      if (Array.isArray(value)) {
        normalized[key] = value.map((v) => 
          (v && typeof v === "object" && v.id != null) ? v.id : v
        )
      } else if (typeof value === "object") {
        normalized[key] = value.name != null ? value.name : value
      }
    }
  })
  
  return normalized
}
