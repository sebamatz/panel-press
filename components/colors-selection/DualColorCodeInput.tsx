import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useColorSelection } from "./ColorSelectionContext";

interface DualColorCodeInputProps {
  position: 'first' | 'second';
}

export default function DualColorCodeInput({ position }: DualColorCodeInputProps) {
  const { dualColorSelections, updateDualColorSelection } = useColorSelection();
  
  const currentSelection = dualColorSelections[position];
  
  const handleChangeColorValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const c = (event.target as HTMLInputElement).value;
    updateDualColorSelection(position, 'colorValue', c);
  };

  if (!currentSelection.selectedColorCompany) return null;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`color-code-input-${position}`} className="text-sm font-medium">
        Κωδικός χρώματος
      </Label>
      <div className="flex max-w-sm items-baseline gap-2">
        <Input
          id={`color-code-input-${position}`}
          onChange={handleChangeColorValue}
          disabled={false}
          value={currentSelection.colorValue || ""}
          placeholder="Εισάγετε κωδικό..."
        />
      </div>
    </div>
  );
}
