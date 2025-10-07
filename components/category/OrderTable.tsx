import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApiStore } from "@/lib/api";
import { ProductDetailsList } from "./ProductDetailsList";
import { Save, Trash2 } from "lucide-react";

// Types
interface ColumnMeta {
  columnId: number;
  field: string;
  title: string;
  colType: string;
  editable: boolean;
  values?: string | null;
}

interface DynamicTableProps {
  columns: ColumnMeta[];
  initialData?: Record<string, any>[];
}

// Parse column values safely into options array
function parseValues(values?: string | null): any[] {
  if (!values) return [];
  if (typeof values === "object") return values as any[];
  try {
    const cleaned = (values as string)
      .replace(/\n/g, "")
      .replace(/\r/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    // If object with nested array (e.g. { gemisi: [...] }) return inner array
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const firstKey = Object.keys(parsed)[0];
      if (Array.isArray((parsed as any)[firstKey])) {
        return (parsed as any)[firstKey];
      }
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse values:", values, e);
    return [];
  }
}

// Cell component to isolate rerenders to only the changed cell
const EditableCell = React.memo(function EditableCell({
  column,
  value,
  onChange,
}: {
  column: ColumnMeta & { component?: React.ComponentType<any> };
  value: any;
  onChange: (field: string, value: any) => void;
}) {
  const options = useMemo(() => parseValues(column.values), [column.values]);

  if ((column as any).component) {
    const Component = (column as any).component as React.ComponentType<any>;
    // Pass both onChange and onSelectionChange to be compatible with custom components
    return (
      <td className="border border-gray-300 p-2">
        <Component
          field={column.field}
          value={value}
          onChange={onChange}
          onSelectionChange={(v: any) => onChange(column.field, v)}
        />
      </td>
    );
  }

  if (column.colType?.toLowerCase() === "string" && options.length > 0) {
    return (
      <td className="border border-gray-300 p-2">
        <select
          className="w-full border rounded p-1"
          value={value || ""}
          onChange={(e) => onChange(column.field, e.target.value)}
        >
          <option value="">Select...</option>
          {options.map((v: any, i: number) => {
            if (v.CODE) return (
              <option key={i} value={v.CODE}>{v.CODE}</option>
            );
            if (v.name) return (
              <option key={i} value={v.name}>{v.name}</option>
            );
            if (typeof v === "string") return (
              <option key={i} value={v}>{v}</option>
            );
            return (
              <option key={i} value={JSON.stringify(v)}>{JSON.stringify(v)}</option>
            );
          })}
        </select>
      </td>
    );
  }

  return (
    <td className="border border-gray-300 p-2">
      <input
        type="text"
        className="w-full border rounded p-1"
        value={value || ""}
        onChange={(e) => onChange(column.field, e.target.value)}
      />
    </td>
  );
}, (prev, next) => {
  // Rerender only if the value for this specific cell changed
  return (
    prev.value === next.value &&
    prev.column === next.column &&
    prev.onChange === next.onChange
  );
});

// Stable custom component for the product column
const ProductCellComponent: React.FC<{
  field: string;
  value: any;
  onChange: (field: string, value: any) => void;
  onSelectionChange?: (value: any) => void;
}> = React.memo(({ field, onChange }) => {
  const handleSelectionChange = useCallback((value: any) => {
    onChange(field, value);
  }, [field, onChange]);

  return (
    <ProductDetailsList onSelectionChange={handleSelectionChange} />
  );
});

const DynamicTable: React.FC<DynamicTableProps> = ({  initialData = [] }) => {
  const [data, setData] = useState<Record<string, any>[]>(initialData);
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState<Record<string, any>>({});
  const { columnSchemas } = useApiStore();

  const getDisplayText = useCallback((value: any, field?: string) => {
    if (value == null) return "";
    if (typeof value === "object") {
      const v: any = value;
      return (
        v.sku ?? v.SKU ?? v.name ?? v.webName ?? v.xdocname ?? JSON.stringify(v)
      );
    }
    return String(value);
  }, []);
  
  const handleAdd = () => {
    setNewRow({});
    setIsAdding(true);
  };

  const handleInputChange = useCallback((field: string, value: any) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = () => {
    setData((prev) => [...prev, newRow]);
    setIsAdding(false);
    setNewRow({});
  };
  
  const handleDelete = useCallback((rowIndex: number) => {
    setData((prev) => prev.filter((_, i) => i !== rowIndex));
  }, []);
  


  const productColumn = useMemo(() => ({
    columnId: 123-23,
    field: "product",
    title: "Product",
    colType: "string",
    values: null,
    component: ProductCellComponent,
  }), []);
 


  

  const columns = useMemo(() => (
    columnSchemas && columnSchemas.length > 0 ? columnSchemas.map((item) => ({
      columnId: item.columnId,
      field: item.field,
      title: item.title,
      colType: item.colType,
      values: item.values,
      component: (item as any).component,
    })) : []
  ), [columnSchemas]);

  const encodedColumnSchemasWithoutId = columns.filter((col) => col.title !== "ΚΩΔΙΚΟΣ");
  const encodedColumnSchemas = useMemo(() => [productColumn, ...encodedColumnSchemasWithoutId], [productColumn, encodedColumnSchemasWithoutId]);

  // remove id column


  return (
    <Card className="p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Πίνακας Παραγγελιών</h2>
        <Button onClick={handleAdd}>Προσθήκη</Button>
      </div>

      <CardContent>
        <table className="w-full text-xs border-collapse border border-gray-300">
          <thead>
            <tr>
              {encodedColumnSchemas.map((col) => (
                <th key={col.columnId} className="border border-gray-300 p-2 text-left">
                  {col.title}
                </th>
              ))}
              <th className="border border-gray-300 p-2">Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {encodedColumnSchemas.map((col) => (
                  <td key={col.columnId} className="border border-gray-300 p-2">
                    {getDisplayText(row[col.field], col.field)}
                  </td>
                ))}
                <td className="border border-gray-300 p-2">
                  <Button
                    variant="ghost"
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    aria-label="Διαγραφή"
                    onClick={() => handleDelete(rowIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}

            {isAdding && (
              <tr>
                {encodedColumnSchemas.map((col) => (
                  <EditableCell
                    key={col.columnId}
                    column={col as any}
                    value={newRow[col.field]}
                    onChange={handleInputChange}
                  />
                ))}
                <td className="border border-gray-300 p-2">
                  <Button
                    variant="ghost"
                    className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    aria-label="Αποθήκευση"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default DynamicTable;
  