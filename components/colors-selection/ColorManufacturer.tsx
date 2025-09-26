import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useColorSelection } from "./ColorSelectionContext";
import { useState } from "react";

interface ColorManufacturerProps {
  position?: 'first' | 'second';
  onManifacturerChange?: (value: string) => void;
}

export default function ColorManufacturer({ position, onManifacturerChange }: ColorManufacturerProps) {
  const { 
    manifacturer, 
    selectedManifacturer, 
    setSelectedManifacturer, 
    setColorData, 
    setColorManifacturerValue,
    dualColorSelections,
    setDualColorSelections,
    updateDualColorSelection
  } = useColorSelection();

  // Use dual color selection if position is provided
  const currentManifacturer = position 
    ? dualColorSelections[position].selectedManifacturer 
    : selectedManifacturer;

  const handleChangeManifacturer = (value: string) => {
    if (position) {
      // For dual color mode - batch all updates to prevent side effects
      setDualColorSelections((prev: any) => ({
        ...prev,
        [position]: {
          ...prev[position],
          selectedManifacturer: value,
          colorData: [],
          colorManifacturerValue: ""
        }
      }));
      onManifacturerChange?.(value);
    } else {
      // For single color mode
      setColorData([]);
      setColorManifacturerValue("");
      setSelectedManifacturer(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`manufacturer-select-${position || 'default'}`} className="text-sm font-medium">
        Επιλογή Κατασκευαστή
      </Label>
      <Select value={currentManifacturer} onValueChange={handleChangeManifacturer}>
        <SelectTrigger id={`manufacturer-select-${position || 'default'}`} className="">
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