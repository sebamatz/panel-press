"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddingRowProps {
  value: Record<string, any>
  onChange: (field: string, value: any) => void
  onSave: () => void
  onCancel?: () => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  addingRow?: AddingRowProps
}

export function DataTable<TData, TValue>({
  columns,
  data,
  addingRow,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
              {addingRow ? <TableHead /> : null}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {addingRow ? (
            <TableRow>
              {(columns as any[]).map((col: any) => {
                const field = col.accessorKey ?? col.id
                const opts = (col.meta?.options as any[]) || []
                const editable = col.meta?.editable !== false
                return (
                  <TableCell key={`add-${String(field)}`}>
                    {editable ? (
                      opts.length ? (
                        <Select
                          value={String(addingRow.value[field] ?? "")}
                          onValueChange={(v) => addingRow.onChange(String(field), v)}
                        >
                          <SelectTrigger className="h-8" aria-label={String(col.header ?? field)}>
                            <SelectValue placeholder={String(col.header ?? field)} />
                          </SelectTrigger>
                          <SelectContent>
                            {opts.map((opt: any, idx: number) => (
                              <SelectItem key={`${String(field)}-${idx}`} value={String(opt)}>
                                {String(opt)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          className="h-8"
                          value={String(addingRow.value[field] ?? "")}
                          onChange={(e) => addingRow.onChange(String(field), e.target.value)}
                          placeholder={String(col.header ?? field)}
                        />
                      )
                    ) : null}
                  </TableCell>
                )
              })}
              <TableCell>
                <div className="flex items-center gap-2">
                  {addingRow.onCancel ? (
                    <Button size="sm" variant="outline" onClick={addingRow.onCancel}>Cancel</Button>
                  ) : null}
                  <Button size="sm" onClick={addingRow.onSave}>Save</Button>
                </div>
              </TableCell>
            </TableRow>
          ) : null}

          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            !addingRow && (
              <TableRow>
                <TableCell colSpan={(columns as any[]).length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}