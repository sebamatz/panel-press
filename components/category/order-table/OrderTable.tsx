  import React, { useCallback, useEffect, useMemo } from "react";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import { useApiStore } from "@/lib/api";
  import { ProductDetailsList } from "../ProductDetailsList";
  import { Edit, Save, Trash2, X, Send } from "lucide-react";
  import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
  import { useOrderTableStore } from "@/lib/stores/orderTableStore";
  import { toast } from "sonner";
  import ColorCell from "./ColorCell";
  import DimensionCell from "./DimensionCell";
  import { normalizeRowForSave, parseValues } from "./utils";
  import { ColumnSchema } from "@/api/types";

import Cell from "./Cell";
import DependOndimesionSelect from "./DependOndimesionSelect";
import PriceCell from "./PriceCell";

  // Parse column values safely into options array

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


  const DynamicTable: React.FC<DynamicTableProps> = () => {
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

    const handleAdd = () => {
      setNewRow({});
      setIsAdding(true);
    };

    const handleInputChange = useCallback((field: string, value: any) => {
      updateNewRowField(field, value);
    }, [updateNewRowField]);

    const handleSave = () => {
      if(newRow.product == null){
        toast.error("Παρακαλώ επιλέξτε προϊόν");
        return;
      }
      if(!newRow.qty1){
        toast.error("Παρακαλώ επιλέξτε ποσότητα");
        return;
      }
      // const normalized = normalizeRowForSave(newRow);
      addOrder(newRow);
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
      saveEdit();
    }, [editingIndex, draftRow, saveEdit]);

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
      title: "ΠΡΟΪΟΝ",
      colType: "string",
      values: null,
      component: ProductCellComponent,
    }), []);

    const colorColumn = useMemo(() => ({
      editable: true,
      component: ColorCell,
      locked: true,
    }), []);
    const dimensionColumn = useMemo(() => ({
      options: columnSchemas?.find((col) => col.field === "dimension")?.values,
      component: DimensionCell,
    }), []);

    const gemisiColumn = useMemo(() => ({
      options: columnSchemas?.find((col) => col.field === "gemisi")?.values,
      component: DependOndimesionSelect,
    }), []);
    const lamarinColumn = useMemo(() => ({
      options: columnSchemas?.find((col) => col.field === "lamarina")?.values,
      component: DependOndimesionSelect,
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




    const excludedColumns = ["sku"];

    

    const encodedColumnSchemasWithoutId = columns.filter((col) => !excludedColumns.includes(col.field));

    const updatedColumns = encodedColumnSchemasWithoutId.map((col) => {
      if(col.field === "dimension") {
        return {...col, ...dimensionColumn};
      }
      if(col.field === "color") {
        return {...col, ...colorColumn};
      }
      if(col.field === "gemisi") {
        return {...col, ...gemisiColumn};
      }
      if(col.field === "lamarina") {
        return {...col, ...lamarinColumn};
      }
      if(col.field === "netamnt") {
        return {...col, ...{component: PriceCell}};
      }
      return col;
    });

    const encodedColumnSchemas = useMemo(() => [productColumn, ...updatedColumns ], [productColumn, updatedColumns]);

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
                      <Cell
                      readOnly={editingIndex !== rowIndex}
                        selectedValues={editingIndex === rowIndex ? draftRow : row}
                        key={col.columnId}
                        column={col as any}
                        value={editingIndex === rowIndex ? draftRow[col.field] : row[col.field]}
                        onChange={handleEditInputChange}
                      />
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
                      <Cell
                        readOnly={false}
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
                    <Button
                      variant="ghost"
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      aria-label="Ακύρωση"
                      onClick={cancelEdit}
                    >
                      <X className="h-4 w-4" />
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
