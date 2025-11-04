"use client"

import * as React from "react"
import Image from "next/image"
import { Check, ChevronsUpDown, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface ComboboxItem {
  id: string | number
  name: string
  description?: string
  [key: string]: any // Allow additional properties
}

export interface ComboboxProps {
  items: ComboboxItem[]
  value?: ComboboxItem | null
  onValueChange?: (item: ComboboxItem | null) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  popoverClassName?: string
  triggerClassName?: string
  disabled?: boolean
  loading?: boolean
  renderItem?: (item: ComboboxItem) => React.ReactNode
  renderSelected?: (item: ComboboxItem) => React.ReactNode
  showBadge?: boolean
  badgeText?: string
  icon?: React.ReactNode
  title?: string
  showTitle?: boolean
  badgeCount?: number
  badgeLabel?: string
  handleSearch?: (value: string) => void
}

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Select an item...",
  searchPlaceholder = "Search items...",
  emptyMessage = "No items found.",
  className,
  popoverClassName,
  triggerClassName,
  disabled = false,
  loading = false,
  renderItem,
  renderSelected,
  showBadge = false,
  badgeText = "New",
  icon,
  title,
  showTitle = false,
  badgeCount,
  badgeLabel,
  handleSearch,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    debugger;
    const selected = items.find((item) => item.name === currentValue)
    onValueChange?.(selected || null)
    setOpen(false)
  }

  const defaultRenderItem = (item: ComboboxItem) => (
    <Card key={item.id} className="w-full hover:shadow-md transition-shadow cursor-pointer border-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <span key="icon" className="text-green-600">{icon}</span>}
            <div key="content">
              <h3 className="font-medium text-gray-900 text-sm md:text-base">
                {item.name}
              </h3>
              {item.webName && (
                <p className="text-xs text-gray-500 mt-1">
                  {item.webName}
                </p>
              )}
              {item.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
          <div key="actions" className="flex items-center space-x-2">
            {showBadge && (
              <Badge key="badge" variant="secondary" className="text-xs">
                {badgeText}
              </Badge>
            )}
            <Check
              key="check"
              className={cn(
                "h-4 w-4",
                value?.id === item.id ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
          {item.imgUrl && (
            <Image src={item.imgUrl} alt={item.name} width={40} height={40} className="rounded-md" />
          )}
        </div>
      </CardContent>
    </Card>
  )

  const defaultRenderSelected = (item: ComboboxItem) => item.name

  return (
    <div className={cn("space-y-4", className)}>
      {showTitle && title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {badgeCount !== undefined && (
            <Badge variant="secondary">
              {badgeCount} {badgeLabel || "items available"}
            </Badge>
          )}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", triggerClassName)}
            disabled={disabled || loading}
          >
            {loading ? (
              "Loading..."
            ) : value ? (
              renderSelected ? renderSelected(value) : defaultRenderSelected(value)
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0 max-w-[80vw]", popoverClassName)} align="start">
        <Command className="min-w-[400px]">
          <CommandInput placeholder={searchPlaceholder} className="h-9" onValueChange={handleSearch} />
          <CommandList className="max-h-[400px]">
            <CommandEmpty className="p-4">{emptyMessage}</CommandEmpty>
            {/* check if items is an array or object */}
            {Array.isArray(items) ? (
              <CommandGroup>
                {items.map((item, index) => (
                  <CommandItem
                    key={index}
                    value={item.name}
                    onSelect={handleSelect}
                    className="p-0"
                  >
                    {renderItem ? renderItem(item) : defaultRenderItem(item)}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandGroup>
                {Object.values(items).map((item: any, index: number) => (
                  <CommandItem
                    key={index}
                    value={item?.id}
                    onSelect={handleSelect}
                    className="p-0"
                  >
                    {renderItem ? renderItem(item) : defaultRenderItem(item)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    </div>
  )
}

// Specialized combobox for products
export interface SeriesComboboxProps extends Omit<ComboboxProps, 'items' | 'icon'> {
  products: ComboboxItem[]
}

 