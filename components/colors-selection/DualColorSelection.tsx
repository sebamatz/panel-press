import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColorSelection } from "./ColorSelectionContext";
import { getItems } from "@/api/fetch";
import { company } from "@/config";
import ColorCodeInput from "./ColorCodeInput";
import DualColorCodeInput from "./DualColorCodeInput";
import ColorManufacturer from "./ColorManufacturer";
import ManifacturerColors from "./ManifacturerColors";

interface IColorData {
  ccCPOUDRAID: number;
  sku: string;
}

interface DualColorSelectionProps {
  position: 'first' | 'second';
  label: string;
}

export default function DualColorSelection({ position, label }: DualColorSelectionProps) {
  const {
    colorTypes,
    setColorTypes,
    manifacturer,
    setManifacturer,
    dualColorSelections,
    updateDualColorSelection,
    colorCompanies,
  } = useColorSelection();

  const currentSelection = dualColorSelections[position];
  const [colorValue, setColorValue] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleChangeColorType = useCallback(
    (value: string) => {
      setColorValue("");
      updateDualColorSelection(position, 'colorType', value);
      updateDualColorSelection(position, 'selectedManifacturer', "");
      updateDualColorSelection(position, 'colorData', []);
      updateDualColorSelection(position, 'colorManifacturerValue', "");
    },
    [position, updateDualColorSelection]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setColorValue(value);
    },
    []
  );

  const handleChangeColor = useCallback(
    (value: string) => {
      setColorValue(value);
    },
    []
  );

  // Simple effect to fetch colors when manufacturer changes
  useEffect(() => {
    if (currentSelection.selectedManifacturer && currentSelection.colorType !== "3") {
      setColorValue("");
      
      const fetchColors = async () => {
        const data: IColorData[] = await getItems({
          BOption: 50,
          Company: company,
          id: Number(currentSelection.colorType) === 3 ? 20 : Number(currentSelection.selectedManifacturer),
          LastId: Number(currentSelection.colorType),
          SearchValue: currentSelection.colorValue || colorValue,
        });
        updateDualColorSelection(position, 'colorData', data);
      };
      
      fetchColors();
    }
  }, [currentSelection.selectedManifacturer, currentSelection.colorType]);

  return currentSelection.selectedTrdpgroup === 1 ? (
    <div className="space-y-4 w-full">
      <div className="flex items-baseline gap-4">
        <div className="space-y-2">
          <Label htmlFor={`color-type-select-${position}`} className="text-sm font-medium">
            {label}
          </Label>
          <Select 
            value={currentSelection.colorType} 
            onValueChange={handleChangeColorType}
          >
            <SelectTrigger id={`color-type-select-${position}`} className="w-full max-w-sm">
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
        {currentSelection.colorType === "3" ? (
          <DualColorCodeInput position={position} />
        ) : (
          <ColorManufacturer 
            position={position}
          />
        )}
        
        {/* Color Selection Combobox */}
        {currentSelection.selectedManifacturer && currentSelection.colorType !== "3" && (
          <ManifacturerColors 
            position={position}
            colorData={currentSelection.colorData}
            onColorChange={handleChangeColor}
            onInputChange={handleInputChange}
          />
        )}
      </div>
    </div>
  ) : (
    <DualColorCodeInput position={position} />
  );
}
