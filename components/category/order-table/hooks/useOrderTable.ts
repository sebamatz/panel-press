import { useCallback, useEffect, useMemo, memo } from "react";
import { useApiStore } from "@/lib/api";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";
import { toast } from "sonner";
import { generateOrderPDF } from "@/lib/utils/pdfGenerator";
import ColorCell from "../ColorCell";
import DimensionCell from "../DimensionCell";
import DependOndimesionSelect from "../DependOndimesionSelect";
import PriceCell from "../PriceCell";
import ProductCellComponent from "../ProductCell";
import { fetchColorPrice } from "@/api/colors";
import { IGetPricePayload, IGetPriceJToken } from "@/api/types";
import { profilColorsType } from "@/components/colors-selection/ProfileColorOptions";

ProductCellComponent.displayName = "ProductCellComponent";

export const useOrderTable = () => {
  const { columnSchemas, selectedCategoryDetails, selectedbaseCategory } =
    useApiStore();
  const colorSelectionStore = useColorSelectionStore();
  const { primaryColorValue } = colorSelectionStore;
  const { profilColors } = useColorSelectionStore();
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
    resetUI,
    updateOrder,
  } = useOrderTableStore();

  // Event handlers
  const handleAdd = useCallback(() => {
    setNewRow({});
    setIsAdding(true);
  }, [setNewRow, setIsAdding]);

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      updateNewRowField(field, value);
    },
    [updateNewRowField]
  );

  const handleSave = useCallback(() => {
    if (newRow.product == null && selectedCategoryDetails?.priceC !== 1) {
      toast.error("Παρακαλώ επιλέξτε προϊόν");
      return;
    }
    if (!newRow.qty1) {
      toast.error("Παρακαλώ επιλέξτε ποσότητα");
      return;
    }
    addOrder(newRow);
    resetUI();
  }, [newRow, selectedCategoryDetails?.priceC, addOrder, resetUI]);

  const handleDelete = useCallback(
    (rowIndex: number) => {
      deleteOrder(rowIndex);
    },
    [deleteOrder]
  );

  const handleEdit = useCallback(
    (rowIndex: number) => {
      setEditingIndex(rowIndex);
      setDraftRow({ ...data[rowIndex] });
    },
    [data, setEditingIndex, setDraftRow]
  );

  const handleEditInputChange = useCallback(
    (field: string, value: any) => {
      updateDraftRowField(field, value);
    },
    [updateDraftRowField]
  );

  const handleSaveEdit = useCallback(() => {
    if (editingIndex === null) return;
    saveEdit();
  }, [editingIndex, saveEdit]);

  const handleCancelEdit = useCallback(() => {
    cancelEdit();
  }, [cancelEdit]);

  const handleSubmitOrders = useCallback(async () => {
    try {
      await submitOrders();
      toast.success("Orders submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit orders");
    }
  }, [submitOrders]);

  // Column configurations
  const productColumn = useMemo(
    () => ({
      columnId: 123 - 23,
      field: "product",
      title: "ΠΡΟΪΟΝ",
      colType: "string",
      values: null,
      component: ProductCellComponent,
    }),
    []
  );

  const colorColumn = useMemo(
    () => ({
      editable: true,
      component: ColorCell,
      locked: true,
    }),
    []
  );

  const dimensionColumn = useMemo(
    () => ({
      options: columnSchemas?.find((col) => col.field === "dimension")?.values,
      component: DimensionCell,
    }),
    [columnSchemas]
  );

  const gemisiColumn = useMemo(
    () => ({
      options: columnSchemas?.find((col) => col.field === "gemisi")?.values,
      component: DependOndimesionSelect,
    }),
    [columnSchemas]
  );

  const lamarinColumn = useMemo(
    () => ({
      options: columnSchemas?.find((col) => col.field === "lamarina")?.values,
      component: DependOndimesionSelect,
    }),
    [columnSchemas]
  );

  // Process columns
  const columns = useMemo(
    () =>
      columnSchemas && columnSchemas.length > 0
        ? columnSchemas.map((item) => ({
            columnId: item.columnId,
            field: item.field,
            title: item.title,
            colType: item.colType,
            values: item.values,
            component: (item as any).component,
          }))
        : [],
    [columnSchemas]
  );

  const excludedColumns = ["sku"];

  const encodedColumnSchemasWithoutId = useMemo(
    () => columns.filter((col) => !excludedColumns.includes(col.field)),
    [columns]
  );

  const updatedColumns = useMemo(
    () =>
      encodedColumnSchemasWithoutId.map((col) => {
        if (col.field === "dimension") {
          return { ...col, ...dimensionColumn };
        }
        if (col.field === "color") {
          return { ...col, ...colorColumn };
        }
        if (col.field === "gemisi") {
          return { ...col, ...gemisiColumn };
        }
        if (col.field === "lamarina") {
          return { ...col, ...lamarinColumn };
        }
        if (col.field === "netamnt") {
          return { ...col, ...{ component: PriceCell } };
        }
        return col;
      }),
    [
      encodedColumnSchemasWithoutId,
      dimensionColumn,
      colorColumn,
      gemisiColumn,
      lamarinColumn,
    ]
  );

  // Final column schemas based on price calculation setting
  const encodedColumnSchemas = useMemo(
    () =>
      selectedCategoryDetails?.priceC === 1
        ? updatedColumns
        : [productColumn, ...updatedColumns],
    [selectedCategoryDetails?.priceC, productColumn, updatedColumns]
  );

  const handleGeneratePDF = useCallback(async () => {
    try {
      await generateOrderPDF({
        orders: data,
        columnSchemas: encodedColumnSchemas,
        categoryName: selectedCategoryDetails?.name || "",
        seriesName: selectedCategoryDetails?.name || "",
        categoryImageUrl:
          selectedCategoryDetails?.imgUrl ||
          selectedCategoryDetails?.images?.[0],
        colorSelection: {
          profilColors: colorSelectionStore.profilColors,
          colorSelectionState: colorSelectionStore.colorSelectionState,
          colorCompanies: colorSelectionStore.colorCompanies,
          colorTypes: colorSelectionStore.colorTypes,
        },
      });
      toast.success("PDF δημιουργήθηκε επιτυχώς!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Σφάλμα κατά τη δημιουργία PDF");
    }
  }, [
    data,
    encodedColumnSchemas,
    selectedCategoryDetails,
    colorSelectionStore.profilColors,
    colorSelectionStore.colorSelectionState,
    colorSelectionStore.colorCompanies,
    colorSelectionStore.colorTypes,
  ]);

  const recalculatePrice = useCallback(async () => {
    // Skip if required values are missing
    if (!selectedbaseCategory || !selectedCategoryDetails || !profilColors) {
      return;
    }

    // for each row in data, recalculate the price based on @PriceCell component
    for (let index = 0; index < data.length; index++) {
      const row = data[index];

      // Check if row has all required fields for price calculation
      if (
        row.qty1 &&
        row.dimension?.UTBL03 &&
        row.gemisi &&
        row.lamarina &&
        row.product?.sku
      ) {
        try {
          const JToken: IGetPriceJToken = {
            TRDR: 480,
            Category:
              typeof selectedbaseCategory === "number"
                ? selectedbaseCategory
                : Number(selectedbaseCategory),
            Series: selectedCategoryDetails?.id,
            SKU: row.product?.sku || "",
            Color:
              profilColors === profilColorsType.WHITE.colorType.toString()
                ? 4
                : 2,
            QTY: row.qty1,
            UTBL03: row.dimension.UTBL03,
            gemisi: row.gemisi?.id || 0,
            lamarina: row.lamarina?.id || 0,
          };

          const payload: IGetPricePayload = {
            JToken: JToken,
          };

          const response = await fetchColorPrice(payload);

          // Update the row with the new price
          updateOrder(index, {
            ...row,
            netamnt: response.price,
          });
        } catch (error) {
          console.error(`Error recalculating price for row ${index}:`, error);
        }
      }
    }
  }, [
    data,
    selectedbaseCategory,
    selectedCategoryDetails,
    profilColors,
    updateOrder,
  ]);

  // Effect: Sync primary color value to new row
  useEffect(() => {
    if (primaryColorValue) {
      handleInputChange("color", primaryColorValue);
    }
  }, [primaryColorValue, handleInputChange]);

  // Effect: Recalculate prices when profilColors changes
  useEffect(() => {
    if (
      profilColors &&
      data.length > 0 &&
      selectedbaseCategory &&
      selectedCategoryDetails
    ) {
      recalculatePrice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilColors]);

  return {
    // State
    data,
    isAdding,
    editingIndex,
    newRow,
    draftRow,
    isSubmitting,
    submitError,
    encodedColumnSchemas,
    // Handlers
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
  };
};
