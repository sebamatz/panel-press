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
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useCallback, useEffect, useState } from "react";

export default function ManifacturerColors({ isSecondary = false }) {
const { colorSelectionState, setColorSelectionState } = useColorSelectionStore();
  const index = isSecondary ? 1 : 0;
  const current = colorSelectionState[index];
  const colorData = current?.colorData || [];
  const colorManifacturerValue  = current?.colorManifacturerValue.sky || "";

  const setColorManifacturerValue = useCallback((value: { ccCPOUDRAID: string, sky: string }) => {
    const newState = [...colorSelectionState];
   
      newState[index] = { ...newState[index], colorManifacturerValue: value }; 
      
    setColorSelectionState(newState);
  }, [colorSelectionState, setColorSelectionState, index]);
  const [open, setOpen] = useState(false);

  const handleInputChange = useCallback(
    (value: string) => {
      const selectedColor = colorData.find((color) => color.sku === value);
      setColorManifacturerValue({ ccCPOUDRAID: selectedColor?.ccCPOUDRAID.toString() || "", sky: selectedColor?.sku || "" });
      
    },
    [setColorManifacturerValue, colorData]
  );

  const handleChangeColor = useCallback(
    (value: string) => {
      const selectedColor = colorData.find((color) => color.sku === value);
      setColorManifacturerValue({ ccCPOUDRAID: selectedColor?.ccCPOUDRAID.toString() || "", sky: selectedColor?.sku || "" });
    },
    [setColorManifacturerValue]
  );

  // const handleManifacturerChangeColors = useCallback(async (manifacturer: string) => {
  //   const colors = await fetchColorsByManufacturer({
  //     colorType: current?.colorType,
  //     selectedManifacturer: manifacturer,
  //     colorValue: current?.colorValue,
  //   });
  //   const newState = [...colorSelectionState];
  //   newState[index] = { ...newState[index], colorData: colors };
  //   setColorSelectionState(newState);
  // }, [colorSelectionState, setColorSelectionState, index]);

  // useEffect(() => {
  //   if (colorManifacturerValue) {
  //     handleManifacturerChangeColors(colorManifacturerValue);
  //   }
  // }, [colorManifacturerValue, handleManifacturerChangeColors]);

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
            {colorManifacturerValue || "Επιλέξτε χρώμα..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-sm p-0">
          <Command>
            <CommandInput
              placeholder="Αναζήτηση χρώματος..."
              value={colorManifacturerValue || ""}
              onValueChange={handleInputChange}
            />
            <CommandList>
              <CommandEmpty>Δεν βρέθηκαν χρώματα.</CommandEmpty>
              <CommandGroup>
                {colorData.map((color) => (
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
                        colorManifacturerValue === color.sku ? "opacity-100" : "opacity-0"
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
