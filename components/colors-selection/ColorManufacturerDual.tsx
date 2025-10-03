import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useState } from "react";

interface ColorManufacturerDualProps {
  isSecondary?: boolean;
}

export default function ColorManufacturerDual({ isSecondary = false }: ColorManufacturerDualProps) {
  const store = useColorSelectionStore();
  
  // Get the appropriate state based on isSecondary flag
  const manifacturer = isSecondary ? store.secondaryManifacturer : store.primaryManifacturer;
  const selectedManifacturer = isSecondary ? store.secondarySelectedManifacturer : store.primarySelectedManifacturer;
  
  // Get the appropriate setters
  const setSelectedManifacturer = isSecondary ? store.setSecondarySelectedManifacturer : store.setPrimarySelectedManifacturer;
  const setColorData = isSecondary ? store.setSecondaryColorData : store.setPrimaryColorData;
  const setColorManifacturerValue = isSecondary ? store.setSecondaryColorManifacturerValue : store.setPrimaryColorManifacturerValue;
  
  const handleChangeManifacturer = (value: string) => {
    setColorData([]);
    setColorManifacturerValue("");
    setSelectedManifacturer(value);
  };

  return (
    <div className="space-y-2">
    <Label htmlFor="manufacturer-select" className="text-sm font-medium">
      Επιλογή Κατασκευαστή {isSecondary ? "(2ο)" : "(1ο)"}
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
