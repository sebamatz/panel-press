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
import { useCallback, useState } from "react";

interface ManifacturerColorsDualProps {
  isSecondary?: boolean;
}

export default function ManifacturerColorsDual({ isSecondary = false }: ManifacturerColorsDualProps) {
  const store = useColorSelectionStore();
  
  // Get the appropriate state based on isSecondary flag
  const colorData = isSecondary ? store.secondaryColorData : store.primaryColorData;
  const colorManifacturerValue = isSecondary ? store.secondaryColorManifacturerValue : store.primaryColorManifacturerValue;
  
  // Get the appropriate setter
  const setColorManifacturerValue = isSecondary ? store.setSecondaryColorManifacturerValue : store.setPrimaryColorManifacturerValue;
  
  const [open, setOpen] = useState(false);

  const handleInputChange = useCallback(
    (value: string) => {
      setColorManifacturerValue(value);
    },
    [setColorManifacturerValue]
  );

  const handleChangeColor = useCallback(
    (value: string) => {
      setColorManifacturerValue(value);
    },
    [setColorManifacturerValue]
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Επιλογή Χρώματος {isSecondary ? "(2ο)" : "(1ο)"}</Label>
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
