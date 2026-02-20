import { fetchColorPrice } from "@/api/colors";
import { IGetPricePayload, IGetPriceJToken } from "@/api/types";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";
import { ICellComponentProps } from "./Cell";
import { useEffect, useState } from "react";
import { profilColorsType } from "@/components/colors-selection/ProfileColorOptions";
import { useApiStore } from "@/lib/api";
export default function PriceCell({
  selectedValues,
  column,
  value,
  onChange,
  readOnly,
  field,
  onSelectionChange,
  options,
}: ICellComponentProps) {
  console.log("selectedValues PriceCell", selectedValues);
  const { selectedCategoryDetails, selectedbaseCategory } = useApiStore();
  const { profilColors, colorSelectionState } = useColorSelectionStore();
  const { updateNewRowField } = useOrderTableStore();
  console.log("profilColors", profilColors);

  const [price, setPrice] = useState<number | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  // Check if DUAL_COLOR is selected
  const isDualColor = profilColors === profilColorsType.DUAL_COLOR.colorType.toString();

  //https://www.alfaeorders.com:19443/erpapi/getitems/obj?pars=%7BCompany%3A%2020%2C%20BOption%3A%2080%2C%20id%3A%20480%2C%20LastId%3A10104%2C%20JToken%3A%7B%22QTY%22%3A1%2C%20%22UTBL03%22%3A1%2C%20%22gemisi%22%3A1%2C%22lamarina%22%3A2%7D%7D
  //{Company: 20, BOption: 80, JToken:{"TRDR":480, "Category":1, "Series":1, "SKU": "P-80", "Color":1, "QTY":1, "UTBL03":1, "gemisi":1,"lamarina":2}}
  const handleGetPrice = async () => {
    // If DUAL_COLOR, set price to 0 and show message
    if (isDualColor) {
      setPrice(0);
      setShowMessage(true);
      updateNewRowField("price", 0);
      onChange?.("netamnt", 0);
      return;
    }

    console.log("selectedValues", selectedValues);

    const JToken: IGetPriceJToken = {
      TRDR: 480,
      Category:
        typeof selectedbaseCategory === "number"
          ? selectedbaseCategory
          : Number(selectedbaseCategory),
      Series: selectedCategoryDetails?.id,
      SKU: selectedValues.product?.sku || "",
      Color:
        profilColors === profilColorsType.WHITE.colorType.toString() ? 4 : colorSelectionState[0]?.colorType,
      QTY: selectedValues.qty1,
      UTBL03: selectedValues.dimension.UTBL03,
      gemisi: selectedValues.gemisi?.id || 0,
      lamarina: selectedValues.lamarina?.id || 0,
    };
    const payload: IGetPricePayload = {
      JToken: JToken,
    };
    const response = await fetchColorPrice(payload);
    console.log("response", response);
    setPrice(response.price);
    setShowMessage(false);
    updateNewRowField("mtrl", response.mtrl);
    updateNewRowField("price", response.price);

    onChange?.("netamnt", response.price);
  };

  useEffect(() => {
    if (
      selectedValues.qty1 &&
      selectedValues.dimension &&
      selectedValues.gemisi &&
      selectedValues.lamarina
    ) {
      handleGetPrice();
    }
  }, [
    selectedValues.qty1,
    selectedValues.dimension,
    selectedValues.gemisi,
    selectedValues.lamarina,
    profilColors,
  ]);

  // Reset message when switching away from DUAL_COLOR
  useEffect(() => {
    if (!isDualColor) {
      setShowMessage(false);
    }
  }, [isDualColor]);

  if (showMessage && isDualColor) {
    return (
      <div className="text-xs text-blue-600 italic">
        Θα σας καλέσει το αρμόδιο τμήμα για να σας ενημερώσει για την τιμή
      </div>
    );
  }

  return <span>{price}</span>;
}
