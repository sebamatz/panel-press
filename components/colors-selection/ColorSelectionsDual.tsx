import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import ColorCodeInputDual from "./ColorCodeInputDual";
import ColorManufacturerDual from "./ColorManufacturerDual";
import ManifacturerColorsDual from "./ManifacturerColorsDual";

interface ColorSelectionsDualProps {
  isSecondary?: boolean;
}

export default function ColorSelectionsDual({ isSecondary = false }: ColorSelectionsDualProps) {
  const store = useColorSelectionStore();
  
  // Get the appropriate state based on isSecondary flag
  const colorTypes = store.colorTypes;
  const colorType = isSecondary ? store.secondaryColorType : store.primaryColorType;
  const selectedManifacturer = isSecondary ? store.secondarySelectedManifacturer : store.primarySelectedManifacturer;
  const selectedTrdpgroup = isSecondary ? store.secondarySelectedTrdpgroup : store.primarySelectedTrdpgroup;
  const colorValue = isSecondary ? store.secondaryColorValue : store.primaryColorValue;
  
  // Get the appropriate setters
  const setColorType = isSecondary ? store.setSecondaryColorType : store.setPrimaryColorType;
  const setColorValue = isSecondary ? store.setSecondaryColorValue : store.setPrimaryColorValue;
  const fetchColors = store.fetchColors;
  const resetManufacturer = isSecondary ? store.resetSecondaryManufacturer : store.resetPrimaryManufacturer;
  const fetchManufacturers = store.fetchManufacturers;

  const handleChangeColorType = useCallback(
    (value: string) => {
      setColorValue("");
      setColorType(value);
      resetManufacturer();
    },
    [setColorValue, setColorType, resetManufacturer]
  );

  const handleGetColor = useCallback(async () => {
    await fetchColors({
      colorType,
      selectedManifacturer,
      colorValue,
    }, isSecondary);
  }, [colorType, colorValue, selectedManifacturer, fetchColors, isSecondary]);

  useEffect(() => {
    if (selectedManifacturer && colorType !== "3") {
      handleGetColor();
    }
  }, [selectedManifacturer, handleGetColor, colorType]);

  // Fetch manufacturers when color type changes
  useEffect(() => {
    if (colorType) {
      fetchManufacturers(isSecondary);
    }
  }, [colorType, fetchManufacturers, isSecondary]);

  return selectedTrdpgroup === 1 ? (
    <div className="space-y-4 w-full">
      <div className="flex items-baseline gap-4">
        {/* Color Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="color-type-select" className="text-sm font-medium">
            Τύπος Χρώματος {isSecondary ? "(2ο)" : "(1ο)"}
          </Label>
          <Select value={colorType} onValueChange={handleChangeColorType}>
            <SelectTrigger id="color-type-select" className="w-full max-w-sm">
              <SelectValue placeholder="Επιλέξτε τύπο χρώματος" />
            </SelectTrigger>
            <SelectContent>
              {colorTypes.map((colorType) => (
                <SelectItem key={colorType.id} value={colorType.id.toString()}>
                  {colorType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Conditional rendering based on colorType */}
        {colorType === "3" ? (
          <ColorCodeInputDual isSecondary={isSecondary} />
        ) : (
          <ColorManufacturerDual isSecondary={isSecondary} />
        )}
        {/* Color Selection Combobox */}
        {selectedManifacturer && colorType !== "3" && (
          <ManifacturerColorsDual isSecondary={isSecondary} />
        )}
      </div>
    </div>
  ) : (
    <ColorCodeInputDual isSecondary={isSecondary} />
  );
}
