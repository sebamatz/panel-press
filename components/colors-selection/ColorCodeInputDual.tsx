import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";

interface ColorCodeInputDualProps {
  isSecondary?: boolean;
}

export default function ColorCodeInputDual({ isSecondary = false }: ColorCodeInputDualProps) {
  const store = useColorSelectionStore();
  
  // Get the appropriate state based on isSecondary flag
  const colorValue = isSecondary ? store.secondaryColorValue : store.primaryColorValue;
  const selectedColorCompany = isSecondary ? store.secondarySelectedColorCompany : store.primarySelectedColorCompany;
  
  // Get the appropriate setter
  const setColorValue = isSecondary ? store.setSecondaryColorValue : store.setPrimaryColorValue;
  
  const handleChangeColorValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const c = (event.target as HTMLInputElement).value;
    setColorValue(c);
  };

  if(!selectedColorCompany) return null;

  return (
    <div className="flex flex-col gap-2">
        <Label htmlFor="color-code-input" className="text-sm font-medium">
          Κωδικός χρώματος {isSecondary ? "(2ο)" : "(1ο)"}
        </Label>
      <div className="flex max-w-sm items-baseline gap-2">
        <Input
          id="color-code-input"
          onChange={handleChangeColorValue}
          disabled={false}
          value={colorValue || ""}
          placeholder="Εισάγετε κωδικό..."
        />
      </div>
      
    </div>
  );
}
