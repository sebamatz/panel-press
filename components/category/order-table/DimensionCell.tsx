import { useEffect } from "react";
import { ICellComponentProps } from "./Cell";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";

export default function DimensionCell({
  selectedValues,
  column,
  value,
  onChange,
  readOnly,
  field,
  onSelectionChange,
  options,
}: ICellComponentProps) {
  const { newRow } = useOrderTableStore();
  console.log("newRow", newRow);

  const handleChange = (value: any) => {
    const selectedOption = options.find(
      (option: any) => option.UTBL03.toString() === value.toString()
    );
    onChange &&
      onChange(column.field, { ...selectedOption, name: selectedOption?.CODE });
  };

  if (!column) return null;

  const filteredValues = column.values.filter(
    (v: any) => v?.NUM01 == newRow?.product?.plaino
  );

  return (
    <select
      className="w-full border rounded p-1"
      value={value?.UTBL03 || ""}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">Select...</option>
      {filteredValues
        .map((v: any, i: number) => {
          if (v?.UTBL03)
            return (
              <option key={i} value={v.UTBL03}>
                {v.CODE}
              </option>
            );
          if (v?.name)
            return (
              <option key={i} value={v.id}>
                {v.name}
              </option>
            );

          if (v?.fora)
            return (
              <option key={i} value={v.fora}>
                {v.fora}
              </option>
            );

          if (typeof v === "string")
            return (
              <option key={i} value={v}>
                {v}
              </option>
            );
          return (
            <option key={i} value={v}>
              {v}
            </option>
          );
        })
        .filter((v: any) => {
          console.log("v", v);
          return v?.NUM01 == 1 || v?.NUM01 === undefined;
        })}
    </select>
  );
}
