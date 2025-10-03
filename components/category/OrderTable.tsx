import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApiStore } from "@/lib/api";

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

const DynamicTable: React.FC<DynamicTableProps> = ({  initialData = [] }) => {
  const [data, setData] = useState<Record<string, any>[]>(initialData);
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState<Record<string, any>>({});
  const { columnSchemas } = useApiStore();

  const columns = columnSchemas && columnSchemas.length > 0 ? columnSchemas.map((item) => ({
    columnId: item.columnId,
    field: item.field,
    title: item.title,
    colType: item.colType,
    values: item.values,
    component: item.component,
  })) : [];

  const handleAdd = () => {
    setNewRow({});
    setIsAdding(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setData((prev) => [...prev, newRow]);
    setIsAdding(false);
    setNewRow({});
  };
  const parseValues = (values?: string | null) => {
    if (!values) return [];
    if (typeof values === "object") return values as any[];
    try {
    const cleaned = (values as string)
    .replace(/\n/g, "")
    .replace(/\r/g, "")
    .trim();
    const parsed = JSON.parse(cleaned);
    // Αν είναι object με nested array (π.χ. { gemisi: [...] }) το γυρνάμε σωστά
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

  return (
    <Card className="p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Dynamic Table</h2>
        <Button onClick={handleAdd}>Add</Button>
      </div>

      <CardContent>
        <table className="w-full text-xs border-collapse border border-gray-300">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.columnId} className="border border-gray-300 p-2 text-left">
                  {col.title}
                </th>
              ))}
              {isAdding && <th className="border border-gray-300 p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-300 p-2">
                  <ProductDetailsList />
                </td>
                {columns.map((col) => (
                  <td key={col.columnId} className="border border-gray-300 p-2">
                    {row[col.field]}
                  </td>
                ))}
              </tr>
            ))}

            {isAdding && (
              <tr>{columns.map((col) => {
                const values = parseValues(col.values);
                console.log("Values for", col.field, values);

                // 1️⃣ Αν υπάρχει custom component
                if ((col as any).component) {
                  const Component = (col as any).component;
                  return (
                    <td key={col.columnId} className="border border-gray-300 p-2">
                      <Component
                field={col.field}
                value={newRow[col.field]}
                onChange={handleInputChange}
                />
                </td>
                );
                }
                
                
                // 2️⃣ Αν είναι select με string values
                if (col.colType?.toLowerCase() === "string" && values.length > 0) {
                return (
                <td key={col.columnId} className="border border-gray-300 p-2">
                <select
                className="w-full border rounded p-1"
                value={newRow[col.field] || ""}
                onChange={(e) => handleInputChange(col.field, e.target.value)}
                >
                <option value="">Select...</option>
                {values.map((v: any, i: number) => {
                // Αν έχει CODE
                if (v.CODE) return <option key={i} value={v.CODE}>{v.CODE}</option>;
                // Αν έχει name
                if (v.name) return <option key={i} value={v.name}>{v.name}</option>;
                // Αν είναι string
                if (typeof v === "string") return <option key={i} value={v}>{v}</option>;
                return <option key={i} value={JSON.stringify(v)}>{JSON.stringify(v)}</option>;
                })}
                </select>
                </td>
                );
                }
                
                
                // 3️⃣ Default input
                return (
                <td key={col.columnId} className="border border-gray-300 p-2">
                <input
                type="text"
                className="w-full border rounded p-1"
                value={newRow[col.field] || ""}
                onChange={(e) => handleInputChange(col.field, e.target.value)}
                />
                </td>
                );
                })}
                <td className="border border-gray-300 p-2">
                <Button onClick={handleSave}>Save</Button>
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
