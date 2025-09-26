import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useColorSelection } from "./ColorSelectionContext";
import { useState } from "react";


export default function ColorManufacturer() {
  const { manifacturer, selectedManifacturer, setSelectedManifacturer, setColorData, setColorManifacturerValue } = useColorSelection();
  const handleChangeManifacturer = (value: string) => {
    setColorData([]);
    setColorManifacturerValue("");
    setSelectedManifacturer(value);
  };

  return (
    <div className="space-y-2">
    <Label htmlFor="manufacturer-select" className="text-sm font-medium">
      Επιλογή Κατασκευαστή
    </Label>
    <Select value={selectedManifacturer} onValueChange={handleChangeManifacturer}>
      <SelectTrigger id="manufacturer-select" className="">
        <SelectValue placeholder="Επιλέξτε κατασκευαστή" />
      </SelectTrigger>
      <SelectContent>
        {manifacturer.map((manufacturer: { trdr: number; name: string }) => (
          <SelectItem key={manufacturer.trdr} value={manufacturer.trdr.toString()}>
            {manufacturer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  );
}