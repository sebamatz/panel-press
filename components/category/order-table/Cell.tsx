import React from "react";
import DependOndimesionSelect from "./DependOndimesionSelect";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { ColumnSchema } from "@/api/types";
import Image from "next/image";

function ReadableCell({ value, column }: { value: any; column: ColumnSchema }) {
  console.log("value", value);
  console.log("column", column);
  if (typeof value === "object") {
    return (
      <td className="border border-gray-300 p-2">
        <div className="flex items-center gap-2">
          <div>
        <div>{value.name}</div><br />
        <div>{value?.webName}</div>
        </div>
        {value.imgUrl && (
          <Image src={value.imgUrl} alt={value.name} width={50} height={50} className="rounded-md" />
        )}
        </div>
      </td>
    );
  }
  return (
    <td className="border border-gray-300 p-2">
      <span>{value}</span>
    </td>
  );
}

// define nterface for componet
export interface ICellComponentProps {
  selectedValues: any;
  column: ColumnSchema;
  value: any;
  onChange?: (field: string, value: any) => void;
  readOnly: boolean;
  field: string;  
  onSelectionChange?: (field: string, value: any) => void;
  options?: any;
  values?: any;
}

export default function Cell({
  selectedValues,
  readOnly,
  column,
  value,
  onChange,
}: {
  selectedValues?: any;
  column: ColumnSchema;
  value: any;
  onChange?: (field: string, value: any) => void;
  readOnly: boolean;
  values: any;
}) {

  // If the column is locked and has a component, render the component
  if (column.locked && (column as any).component) {
    const Component = (column as any).component as React.ComponentType<ICellComponentProps>;
    return (
      <td className="border border-gray-300 p-2">
        <Component
          values={column.values}
          readOnly={readOnly}
          field={column.field}
          value={value}
          onChange={onChange}
          onSelectionChange={(v: any) => onChange && onChange(column.field, v)}
          selectedValues={selectedValues}
          column={column}
        />
      </td>
    );
  }

  // If the column is read only, render the readable cell
  if (readOnly) {
    return <ReadableCell value={value} column={column} />;
  }

  // If the column is editable and has a component, render the component
  if ((column as any).component) {
    const Component = (column as any).component as React.ComponentType<ICellComponentProps>;
    // Pass both onChange and onSelectionChange to be compatible with custom components
    return (
      <td className="border border-gray-300 p-2">
        <Component
          readOnly={readOnly}
          field={column.field}
          value={value}
          onChange={onChange}
          onSelectionChange={(v: any) => onChange && onChange(column.field, v)}
          selectedValues={selectedValues}
          options={column.values}
          column={column}
        />
      </td>
    );
  }



  // if (column.field === "color") {
  //   const handleColorChange = (colorValue: string) => {
  //     setPrimaryColorValue(colorValue);
  //     onChange(column.field, colorValue);
  //   };

  //   // Use the value from the row data if available, otherwise use the store value
  //   const currentValue = value || primaryColorValue || "";

  //   return (
  //     <td className="border border-gray-300 p-2">
  //       <div className="flex items-center gap-2">
  //         <input
  //           type="text"
  //           className="w-full border rounded p-1"
  //           value={currentValue}
  //           onChange={(e) => handleColorChange(e.target.value)}
  //           placeholder="Enter color value"
  //         />
  //         {currentValue && (
  //           <div
  //             className="w-6 h-6 border border-gray-300 rounded"
  //             style={{ backgroundColor: currentValue }}
  //             title={currentValue}
  //           />
  //         )}
  //       </div>
  //     </td>
  //   );
  // }

  // If the column is a select, render the select
  if (column.colType?.toLowerCase() === "select" && column.values.length > 0) {
    return (
      <td className="border border-gray-300 p-2">
        <select
          className="w-full border rounded p-1"
          value={value || ""}
          onChange={(e) => onChange && onChange(column.field, e.target.value)}
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
      </td>
    );
  }
  return (
    <td className="border border-gray-300 p-2">
      <input
        id={column.field}
        readOnly={column.editable !== undefined ? true : false}
        type={column.colType === "number" ? "number" : "text"}
        className="w-full border rounded p-1"
        value={value || ""}
        onChange={(e) => onChange && onChange(column.field, e.target.value)}
      />
    </td>
  );
}
