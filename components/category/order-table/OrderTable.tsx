import React, { useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApiStore } from "@/lib/api";
import { ProductDetailsList } from "../ProductDetailsList";
import { Edit, Save, Trash2, X, Send } from "lucide-react";
import EditableCell from "./EditableCell";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";
import { toast } from "sonner";

// Parse column values safely into options array
export function parseValues(values?: string | null): any[] {
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


// Stable custom component for the product column
type DynamicTableProps = {
  initialData?: Record<string, any>[];
};
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


const DynamicTable: React.FC<DynamicTableProps> = ({ initialData = [] }) => {
  const { columnSchemas } = useApiStore();
  
  // Use store state and actions
  const {
    orders: data,
    isAdding,
    editingIndex,
    newRow,
    draftRow,
    isSubmitting,
    submitError,
    addOrder,
    deleteOrder,
    setIsAdding,
    setEditingIndex,
    setDraftRow,
    setNewRow,
    updateNewRowField,
    updateDraftRowField,
    saveEdit,
    cancelEdit,
    submitOrders,
    clearOrders,
    resetUI
  } = useOrderTableStore();

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

  const getCellText = useCallback((col: any, value: any, row?: Record<string, any>) => {
    if (value == null) return "";
    if (value === "undefined" || value === "null") return "";

    // Handle color field specially
    if (col.field === "color") {
      return value || "";
    }

    // Handle arrays (e.g., DependOndimesionSelect returns [selectedOption])
    if (Array.isArray(value)) {
      if (value.length === 0) return "";
      const labels = value.map((item) => {
        if (item && typeof item === "object") {
          if (item.name != null) return String(item.name);
          if (item.CODE != null) return String(item.CODE);
          return getDisplayText(item, col.field);
        }
        // Primitive stored in array; try to map via options below
        return String(item);
      });
      return labels.join(", ");
    }

    // If column has options, try to map stored value to its label
    let optionsArray: any[] = Array.isArray(col?.values) ? col.values : parseValues(col?.values);

    // For dependent fields, narrow options using row.dimension like DependOndimesionSelect
    const fieldLower = (col.field || "").toString().toLowerCase();
    if (row && (fieldLower === "gemisi" || fieldLower === "lamarina") && optionsArray && optionsArray.length > 0) {
      const parent = optionsArray.find((opt: any) => String(opt?.UTBL03) === String(row?.dimension));
      if (parent) {
        optionsArray = fieldLower === "lamarina" ? parent?.LAMARINA || [] : parent?.gemisi || [];
      } else {
        optionsArray = [];
      }
    }

    if (optionsArray && optionsArray.length > 0) {
      const matchedOption = optionsArray.find((opt: any) => {
        if (opt && typeof opt === "object") {
          if (opt.UTBL03 != null) return String(opt.UTBL03) === String(value);
          if (opt.id != null) return String(opt.id) === String(value);
        }
        return String(opt) === String(value);
      });
      if (matchedOption != null) {
        if (matchedOption.CODE != null) return String(matchedOption.CODE);
        if (matchedOption.name != null) return String(matchedOption.name);
        return getDisplayText(matchedOption, col.field);
      }
    }

    // Fallback for values that are objects (e.g., product objects)
    return getDisplayText(value, col.field);
  }, [getDisplayText]);

  const normalizeRowForSave = useCallback((row: Record<string, any>) => {
    const normalized: Record<string, any> = { ...row };
    Object.keys(normalized).forEach((key) => {
      const fieldLower = key.toString().toLowerCase();
      const value = normalized[key];
      if ((fieldLower === "gemisi" || fieldLower === "lamarina") && value != null) {
        if (Array.isArray(value)) {
          normalized[key] = value.map((v) => (v && typeof v === "object" && v.id != null) ? v.id : v);
        } else if (typeof value === "object") {
          normalized[key] = value.name != null ? value.name : value;
        }
      }
    });
    return normalized;
  }, []);

  const handleAdd = () => {
    setNewRow({});
    setIsAdding(true);
  };

  const handleInputChange = useCallback((field: string, value: any) => {
    updateNewRowField(field, value);
  }, [updateNewRowField]);

  const handleSave = () => {
    if(newRow.product == null){
      toast.error("Please select a product");
      return;
    }
    const normalized = normalizeRowForSave(newRow);
    addOrder(normalized);
    resetUI();
  };

  const handleDelete = useCallback((rowIndex: number) => {
    deleteOrder(rowIndex);
  }, [deleteOrder]);

  const handleEdit = useCallback((rowIndex: number) => {
    setEditingIndex(rowIndex);
    setDraftRow({ ...data[rowIndex] });
  }, [data, setEditingIndex, setDraftRow]);

  const handleEditInputChange = useCallback((field: string, value: any) => {
    updateDraftRowField(field, value);
  }, [updateDraftRowField]);

  const handleSaveEdit = useCallback(() => {
    if (editingIndex === null) return;
    const normalized = normalizeRowForSave(draftRow);
    saveEdit();
  }, [editingIndex, draftRow, normalizeRowForSave, saveEdit]);

  const handleCancelEdit = useCallback(() => {
    cancelEdit();
  }, [cancelEdit]);

  const handleSubmitOrders = async () => {
    try {
      await submitOrders();
      toast.success("Orders submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit orders");
    }
  };

  const productColumn = useMemo(() => ({
    columnId: 123 - 23,
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

  const { primaryColorValue } = useColorSelectionStore();
  useEffect(() => {
    if (primaryColorValue) {
      handleInputChange("color", primaryColorValue);
    }
  }, [primaryColorValue, handleInputChange]);

  useEffect(() => {  
  }, [newRow]);
  return (
    <Card className="p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Πίνακας Παραγγελιών</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmitOrders} 
            disabled={data.length === 0 || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Orders"}
          </Button>
          <Button onClick={handleAdd} disabled={isAdding || editingIndex !== null}>Προσθήκη</Button>
        </div>
      </div>
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          {submitError}
        </div>
      )}

      <CardContent>
        <table className="w-full text-xs border-collapse">
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
                  editingIndex === rowIndex ? (
                    <EditableCell
                      selectedValues={draftRow}
                      key={col.columnId}
                      column={col as any}
                      value={draftRow[col.field]}
                      onChange={handleEditInputChange}
                    />
                  ) : (
                    <td key={col.columnId} className="border border-gray-300 p-2">
                      {col.field === "color" && row[col.field] ? (
                        <div className="flex items-center gap-2">
                          <span>{getCellText(col, row[col.field], row)}</span>
                          <div 
                            className="w-4 h-4 border border-gray-300 rounded"
                            style={{ backgroundColor: row[col.field] }}
                            title={row[col.field]}
                          />
                        </div>
                      ) : (
                        getCellText(col, row[col.field], row)
                      )}
                    </td>
                  )
                ))}
                <td className="border border-gray-300 p-2">
                  {editingIndex === rowIndex ? (
                    <>
                      <Button
                        variant="ghost"
                        className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                        aria-label="Αποθήκευση"
                        onClick={handleSaveEdit}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        aria-label="Ακύρωση"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        aria-label="Διαγραφή"
                        onClick={() => handleDelete(rowIndex)}
                        disabled={editingIndex !== null}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        aria-label="Επεξεργασία"
                        onClick={() => handleEdit(rowIndex)}
                        disabled={isAdding || editingIndex !== null}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {isAdding&& (
              <tr>
                {encodedColumnSchemas.map((col) => {
                  return (
                    <EditableCell
                      selectedValues={newRow}
                      key={col.columnId}
                      column={col as any}
                      value={newRow[col.field]}
                      onChange={handleInputChange}
                    />
                  );
                })}
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
