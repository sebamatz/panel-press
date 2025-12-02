import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Save, Trash2, X, Send, FileDown } from "lucide-react";
import Cell from "./Cell";
import { useOrderTable } from "./hooks/useOrderTable"; 

type DynamicTableProps = {
  initialData?: Record<string, any>[];
};

const DynamicTable: React.FC<DynamicTableProps> = () => {
  const {
    data,
    isAdding,
    editingIndex,
    newRow,
    draftRow,
    isSubmitting,
    submitError,
    encodedColumnSchemas,
    handleAdd,
    handleInputChange,
    handleSave,
    handleDelete,
    handleEdit,
    handleEditInputChange,
    handleSaveEdit,
    handleCancelEdit,
    handleSubmitOrders,
    handleGeneratePDF,
  } = useOrderTable();
  return (
    <Card className="p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Πίνακας Παραγγελιών</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleAdd}
            disabled={isAdding || editingIndex !== null}
          >
            Προσθήκη
          </Button>
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
                <th
                  key={col.columnId}
                  className="border border-gray-300 p-2 text-left"
                >
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
                    value={
                      editingIndex === rowIndex
                        ? draftRow[col.field]
                        : row[col.field]
                    }
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

            {isAdding && (
              <tr>
                {encodedColumnSchemas.map((col) => (
                  <Cell
                    readOnly={false}
                    selectedValues={newRow}
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
                  <Button
                    variant="ghost"
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    aria-label="Ακύρωση"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleGeneratePDF}
          disabled={data.length === 0}
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Εξαγωγή PDF
        </Button>
        <Button
          onClick={handleSubmitOrders}
          disabled={data.length === 0 || isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Παρακαλώ περιμένετε..." : " Υποβολή Παραγγελίας"}
        </Button>
      </div>
    </Card>
  );
};

export default DynamicTable;
