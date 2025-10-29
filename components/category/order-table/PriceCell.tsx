import { fetchColorPrice } from "@/api/colors";
import { IGetPricePayload } from "@/api/types";
import { bOption } from "@/api/utils";
import { companySettings } from "@/config";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";
import { ICellComponentProps } from "./Cell";
import { useEffect, useState } from "react";
import { IGetPriceJToken } from "@/api/types";
export default function PriceCell({selectedValues, column, value, onChange, readOnly, field, onSelectionChange, options }: ICellComponentProps) {
console.log("selectedValues PriceCell", selectedValues);

    const [price, setPrice] = useState<number | null>(null);
//https://www.alfaeorders.com:19443/erpapi/getitems/obj?pars=%7BCompany%3A%2020%2C%20BOption%3A%2080%2C%20id%3A%20480%2C%20LastId%3A10104%2C%20JToken%3A%7B%22QTY%22%3A1%2C%20%22UTBL03%22%3A1%2C%20%22gemisi%22%3A1%2C%22lamarina%22%3A2%7D%7D

    const handleGetPrice = async () => {

        const JToken: IGetPriceJToken = {
            QTY: selectedValues.qty1,
            UTBL03: selectedValues.dimension,
            gemisi: selectedValues.gemisi?.id || 0,
            lamarina: selectedValues.lamarina?.id || 0
        }

        const payload: IGetPricePayload = {
            id:480,
            LastId: 10104,
            JToken:JToken,
        }
        const response = await fetchColorPrice(payload);
        
        setPrice(response.price);
        onChange && onChange("netamnt", response.price);
    }
    
    useEffect(() => {
        if(selectedValues.qty1 && selectedValues.product && selectedValues.dimension && selectedValues.gemisi && selectedValues.lamarina){
            handleGetPrice();
        }
    }, [selectedValues.qty1, selectedValues.product, selectedValues.dimension, selectedValues.gemisi, selectedValues.lamarina]);
    return <span>{price}</span>
}