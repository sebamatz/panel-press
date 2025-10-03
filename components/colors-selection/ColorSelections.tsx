import { useCallback, useEffect, useState } from "react";
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
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import ColorCodeInput from "./ColorCodeInput";
import ColorManufacturer from "./ColorManufacturer";
import ManifacturerColors from "./ManifacturerColors";

export default function ColorSelections() {
  const {
    colorTypes,
    primaryManifacturer,
    primaryColorType,
    primarySelectedManifacturer,
    primarySelectedTrdpgroup,
    primaryColorValue,
    setPrimaryColorType,
    setPrimarySelectedManifacturer,
    setPrimaryColorValue,
    setPrimaryManifacturer,
    setPrimaryColorData,
    fetchColors,
    resetPrimaryManufacturer,
    fetchManufacturers,
  } = useColorSelectionStore();

  const [open, setOpen] = useState(false);

  const handleChangeColorType = useCallback(
    (value: string) => {
      //reset all values
      setPrimaryColorValue("");
      setPrimaryColorType(value);
      resetPrimaryManufacturer();
    },
    [setPrimaryColorValue, setPrimaryColorType, resetPrimaryManufacturer]
  );

  const handleChangeManifacturer = useCallback(
    (value: string) => {
      setPrimaryColorValue("");
      setPrimarySelectedManifacturer(value);
    },
    [setPrimaryColorValue, setPrimarySelectedManifacturer]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setPrimaryColorValue(value);
    },
    [setPrimaryColorValue]
  );

  const handleChangeColor = useCallback(
    (value: string) => {
      setPrimaryColorValue(value);
    },
    [setPrimaryColorValue]
  );

  const handleGetColor = useCallback(async () => {
    await fetchColors({
      colorType: primaryColorType,
      selectedManifacturer: primarySelectedManifacturer,
      colorValue: primaryColorValue,
    }, false);
  }, [primaryColorType, primaryColorValue, primarySelectedManifacturer, fetchColors]);

  useEffect(() => {
    if (primarySelectedManifacturer && primaryColorType !== "3") {
      handleGetColor();
    }
  }, [primarySelectedManifacturer, handleGetColor, primaryColorType]);

  // Initialize color types on component mount
  useEffect(() => {
    const { fetchColorData } = useColorSelectionStore.getState();
    fetchColorData(30);
  }, []);

  // Fetch manufacturers when color type changes
  useEffect(() => {
    if (primaryColorType) {
      const { fetchColorData } = useColorSelectionStore.getState();
      if (primaryColorType === '3') {
        fetchColorData(50);
      } else {
        fetchColorData(40);
      }
    }
  }, [primaryColorType]);

  return primarySelectedTrdpgroup === 1 ? (
    <div className="space-y-4 w-full">
      <div className="flex items-baseline gap-4">
        {/* Color Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="color-type-select" className="text-sm font-medium">
            Τύπος Χρώματος
          </Label>
          <Select value={primaryColorType} onValueChange={handleChangeColorType}>
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
        {primaryColorType === "3" ? <ColorCodeInput /> : <ColorManufacturer />}
        {/* Color Selection Combobox */}
        {primarySelectedManifacturer && primaryColorType !== "3" && <ManifacturerColors />}
      </div>
    </div>
  ) : (
    <ColorCodeInput />
  );
}
