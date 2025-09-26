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

export default function ManifacturerColors() {
  const { colorValue, setColorValue } = useColorSelection();
  const [colorData, setColorData] = useState<IColorData[]>([]);
  const [open, setOpen] = useState(false);

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
            {colorValue || "Επιλέξτε χρώμα..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-sm p-0">
          <Command>
            <CommandInput
              placeholder="Αναζήτηση χρώματος..."
              value={colorValue || ""}
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
                        colorValue === color.sku ? "opacity-100" : "opacity-0"
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
