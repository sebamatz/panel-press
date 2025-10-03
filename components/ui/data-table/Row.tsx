import { useState } from "react"
import { TableCell, TableRow } from "../table"

export default function Row({ saveRow, rowData=[] }: { saveRow: () => void, rowData: any }) {

    const [rowDataState, setRowDataState] = useState<any>(rowData)

    if (!rowDataState) {
        return null
    }


  return (
    <TableRow>
      {rowData.map((data: any) => (
         <TableCell key={data.id}>
         key={data.id}
        name={data.id}
        <input key={data.id} value={rowDataState[data.id]} onChange={(e) => setRowDataState((prev: any) => ({ ...prev, [data.id]: { ...prev[data.id], value: e.target.value } }))} />
       </TableCell>
      ))}
      <button onClick={saveRow}>Save</button>
    </TableRow>
  )
}