import { useCallback } from "react";
import { useEffect, useState } from "react";
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
import ColorManufacturer from "./ColorManufacturer";
import ManifacturerColors from "./ManifacturerColors";

interface IColorData {
  ccCPOUDRAID: number;
  sku: string;
}

export default function ColorSelections() {
  const {
    colorTypes,
    setColorTypes,
    manifacturer,
    setManifacturer,
    colorType,
    setColorType,
    selectedManifacturer,
    setSelectedManifacturer,
    selectedTrdpgroup,
    setColorData,
  } = useColorSelection();
  const [colorValue, setColorValue] = useState<string>("");

  const [open, setOpen] = useState(false);

  const handleChangeColorType = useCallback(
    (value: string) => {
      //reset all values
      setColorValue("");
      //setSelectedManifacturer("");/
      setManifacturer([]);
      setColorType(value);
    },
    [setColorValue]
  );

  const handleChangeManifacturer = useCallback(
    (value: string) => {
      setColorValue("");
      // setSelectedManifacturer(value);
    },
    [setColorValue]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setColorValue(value);
    },
    [setColorValue]
  );

  const handleChangeColor = useCallback(
    (value: string) => {
      setColorValue(value);
    },
    [setColorValue]
  );

  const handleGetColor = useCallback(async () => {
    const data: IColorData[] = await getItems({
      BOption: 50,
      Company: company,
      //if colorType is 3, then id is 20, else id is selectedManifacturer
      id: Number(colorType) === 3 ? 20 : Number(selectedManifacturer),
      LastId: Number(colorType),
      SearchValue: colorValue,
    });
    //[{"ccCPOUDRAID":15606,"sku":"SE802G-MATT-1002"}]
    setColorData(data);
  }, [colorType, colorValue, selectedManifacturer]);

  useEffect(() => {
    if (selectedManifacturer && colorType !== "3") {
      handleGetColor();
    }
  }, [selectedManifacturer, handleGetColor, colorType]);

  return selectedTrdpgroup === 1 ? (
    <div className="space-y-4 w-full">
      <div className="flex items-baseline gap-4">
        {/* Color Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="color-type-select" className="text-sm font-medium">
            Τύπος Χρώματος
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
        {colorType === "3" ? <ColorCodeInput /> : <ColorManufacturer />}
        {/* Color Selection Combobox */}
        {selectedManifacturer && colorType !== "3" && <ManifacturerColors />}
      </div>
    </div>
  ) : (
    <ColorCodeInput />
  );
}
