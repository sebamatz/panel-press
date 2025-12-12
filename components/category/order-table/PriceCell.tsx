import { fetchColorPrice } from "@/api/colors";
import { IGetPricePayload } from "@/api/types";
import { bOption } from "@/api/utils";
import { companySettings } from "@/config";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";
import { ICellComponentProps } from "./Cell";
import { useEffect, useState } from "react";
import { IGetPriceJToken } from "@/api/types";
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
  const { profilColors } = useColorSelectionStore();
  const { updateNewRowField } = useOrderTableStore();
  console.log("profilColors", profilColors);

  const [price, setPrice] = useState<number | null>(null);
  //https://www.alfaeorders.com:19443/erpapi/getitems/obj?pars=%7BCompany%3A%2020%2C%20BOption%3A%2080%2C%20id%3A%20480%2C%20LastId%3A10104%2C%20JToken%3A%7B%22QTY%22%3A1%2C%20%22UTBL03%22%3A1%2C%20%22gemisi%22%3A1%2C%22lamarina%22%3A2%7D%7D
  //{Company: 20, BOption: 80, JToken:{"TRDR":480, "Category":1, "Series":1, "SKU": "P-80", "Color":1, "QTY":1, "UTBL03":1, "gemisi":1,"lamarina":2}}
  const handleGetPrice = async () => {
    console.log("selectedValues", selectedValues);

    const JToken: IGetPriceJToken = {
      TRDR: 480,
      Category: selectedbaseCategory,
      Series: selectedCategoryDetails?.id,
      SKU: selectedValues.product?.sku || "",
      Color:
        profilColors === profilColorsType.WHITE.colorType.toString() ? 4 : 2,
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
    updateNewRowField("mtrl", response.mtrl);
    updateNewRowField("price", response.price);

    onChange && onChange("netamnt", response.price);
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
  return <span>{price}</span>;
}
