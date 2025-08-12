"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X } from "lucide-react"

// Product interface based on the image structure
export type Product = {
  id: string
  code: string
  name: string
  specialRemarks: string
  dimension: string
  color: string
  paintShop: string
  quantity: number
  price: number
  isSelected: boolean
}

// Create columns with event handlers as parameters
export const createColumns = (
  onAddToOrder: (product: Product) => void,
  onRemoveFromOrder: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "code",
    header: "ΚΩΔΙΚΟΣ",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="space-y-1">
          <div className="font-medium">{product.code}</div>
        </div>
      )
    },
  },
 
  {
    accessorKey: "dimension",
    header: "ΔΙΑΣΤΑΣΗ",
    cell: ({ row }) => {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Select defaultValue="90 x 210">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90 x 210">90 x 210</SelectItem>
                <SelectItem value="100 x 200">100 x 200</SelectItem>
                <SelectItem value="100 x 225">100 x 225</SelectItem>
                <SelectItem value="125 x 250">125 x 250</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
        </div>
      )
    },
  },
  {
    accessorKey: "color",
    header: "ΧΡΩΜΑ - ΒΑΦΕΙΟ",
    cell: ({ row }) => {
      return (
        <div className="space-y-2">
          <div className="space-y-1">
            <Select defaultValue="ΛΕΥΚΟ (9010)">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ΛΕΥΚΟ (9010)">ΛΕΥΚΟ (9010)</SelectItem>
                <SelectItem value="ΜΑΥΡΟ (9005)">ΜΑΥΡΟ (9005)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "quantity",
    header: "TEM.",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Input 
            type="number" 
            defaultValue="1" 
            className="w-16"
            min="1"
          />
        </div>
      )
    },
  },
  {
    accessorKey: "specialRemarks",
    header: "Παρατηρήσεις",
    cell: ({ row }) => {
      return (
        <Input 
          placeholder="Ειδικές παρατηρήσεις..."
          className="w-full"
        />
      )
    },
  },
  {
    accessorKey: "price",
    header: "ΤΙΜΗ (χωρίς ΦΠΑ)",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center justify-between">
          <span className="font-medium">€{product.price.toFixed(2)}</span>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
              onClick={() => onAddToOrder(product)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={() => onRemoveFromOrder(product)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    },
  },
] 