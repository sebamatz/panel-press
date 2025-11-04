import { useEffect } from "react";
import { ICellComponentProps } from "./Cell";

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

    const handleChange = (value: any) => {
        const selectedOption = options.find((option: any) => option.UTBL03.toString() === value.toString());
        onChange && onChange(column.field, {...selectedOption,name: selectedOption?.CODE});
    }

    if(!column) return null;

    //set default value if value is not selected
    useEffect(() => {
        if(!value) {
            handleChange(options[0].UTBL03);
        }
    }, []);

  return (
    <select
      className="w-full border rounded p-1"
      value={value?.UTBL03 || ""}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">Select...</option>
      {column.values.map((v: any, i: number) => {
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
      })}
    </select>
  );
}
