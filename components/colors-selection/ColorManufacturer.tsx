import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useState } from "react";


export default function ColorManufacturer() {
  const { primaryManifacturer, primarySelectedManifacturer, setPrimarySelectedManifacturer, setPrimaryColorData, setPrimaryColorManifacturerValue } = useColorSelectionStore();
  const handleChangeManifacturer = (value: string) => {
    setPrimaryColorData([]);
    setPrimaryColorManifacturerValue("");
    setPrimarySelectedManifacturer(value);
  };

  return (
    <div className="space-y-2">
    <Label htmlFor="manufacturer-select" className="text-sm font-medium">
      Επιλογή Κατασκευαστή
    </Label>
    <Select value={primarySelectedManifacturer} onValueChange={handleChangeManifacturer}>
      <SelectTrigger id="manufacturer-select" className="">
        <SelectValue placeholder="Επιλέξτε κατασκευαστή" />
      </SelectTrigger>
      <SelectContent>
        {primaryManifacturer.map((manufacturer: { trdr: number; name: string }) => (
          <SelectItem key={manufacturer.trdr} value={manufacturer.trdr.toString()}>
            {manufacturer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  );
}