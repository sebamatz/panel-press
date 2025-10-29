import { ColumnSchema } from "@/api/types";
export default function ReadableCell({ value, column }: { value: any, column: ColumnSchema }) {
    console.log(value, column);
    // if(value == null) return <span>-</span>;
    // if(column.field === "color") {
    //     return <span style={{ backgroundColor: value }}>{value}</span>;
    // }
    // if(column.field === "gemisi" || column.field === "lamarina") {
    //     return <span>{value.map((v: any) => v.name).join(", ")}</span>;
    // }
    return <span>{value}</span>;
}