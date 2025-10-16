import React from "react";
import DependOndimesionSelect from "./DependOndimesionSelect";

export default function EditableCell({
  selectedValues,
  column,
  value,
  onChange,
}: {
  selectedValues: any;
  column: any;
  value: any;
  onChange: (field: string, value: any) => void;
}) {
  const options = column.values || [];

  if (column.field === "gemisi" || column.field === "lamarina") {
    return (
      <td className="border border-gray-300 p-2">
        <DependOndimesionSelect
        field={column.field}
          selectedValues={selectedValues}
          options={options}
          onSelectionChange={(v: any) => onChange(column.field, v)}
        />
      </td>
    );
  }

  if ((column as any).component) {
    const Component = (column as any).component as React.ComponentType<any>;
    // Pass both onChange and onSelectionChange to be compatible with custom components
    return (
      <td className="border border-gray-300 p-2">
        <Component
          field={column.field}
          value={value}
          onChange={onChange}
          onSelectionChange={(v: any) => onChange(column.field, v)}
        />
      </td>
    );
  }

  if (column.colType?.toLowerCase() === "string" && options.length > 0) {
    return (
      <td className="border border-gray-300 p-2">
        <select
          className="w-full border rounded p-1"
          value={value || ""}
          onChange={(e) => onChange(column.field, e.target.value)}
        >
          <option value="">Select...</option>
          {options.map((v: any, i: number) => {
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
        type="text"
        className="w-full border rounded p-1"
        value={value || ""}
        onChange={(e) => onChange(column.field, e.target.value)}
      />
    </td>
  );
}
