import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColorSelection } from "./ColorSelectionContext";
import { useCallback, useState } from "react";

interface IColorData {
  ccCPOUDRAID: number;
  sku: string;
}

interface ManifacturerColorsProps {
  position?: 'first' | 'second';
  colorData?: IColorData[];
  onColorChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
}

export default function ManifacturerColors({ 
  position, 
  colorData: propColorData, 
  onColorChange, 
  onInputChange 
}: ManifacturerColorsProps) {
  const { 
    colorData: contextColorData, 
    colorManifacturerValue, 
    setColorManifacturerValue,
    dualColorSelections,
    updateDualColorSelection
  } = useColorSelection();
  
  const [open, setOpen] = useState(false);

  // Use prop colorData if provided, otherwise use context
  const currentColorData = propColorData || contextColorData;
  
  // Use dual color selection if position is provided
  const currentColorValue = position 
    ? dualColorSelections[position].colorManifacturerValue 
    : colorManifacturerValue;

  const handleInputChange = useCallback(
    (value: string) => {
      if (position) {
        updateDualColorSelection(position, 'colorManifacturerValue', value);
        onInputChange?.(value);
      } else {
        setColorManifacturerValue(value);
      }
    },
    [position, updateDualColorSelection, setColorManifacturerValue, onInputChange]
  );

  const handleChangeColor = useCallback(
    (value: string) => {
      if (position) {
        updateDualColorSelection(position, 'colorManifacturerValue', value);
        onColorChange?.(value);
      } else {
        setColorManifacturerValue(value);
      }
    },
    [position, updateDualColorSelection, setColorManifacturerValue, onColorChange]
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Επιλογή Χρώματος</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full max-w-sm justify-between"
          >
            {currentColorValue || "Επιλέξτε χρώμα..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-sm p-0">
          <Command>
            <CommandInput
              placeholder="Αναζήτηση χρώματος..."
              value={currentColorValue || ""}
              onValueChange={handleInputChange}
            />
            <CommandList>
              <CommandEmpty>Δεν βρέθηκαν χρώματα.</CommandEmpty>
              <CommandGroup>
                {currentColorData.map((color) => (
                  <CommandItem
                    key={color.ccCPOUDRAID}
                    value={color.sku}
                    onSelect={(currentValue) => {
                      handleChangeColor(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentColorValue === color.sku ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {color.sku}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
