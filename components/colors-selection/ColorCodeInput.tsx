import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useColorSelection } from "./ColorSelectionContext";

export default function ColorCodeInput() {
  const { colorValue, setColorValue, selectedColorCompany } = useColorSelection();
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
          Κωδικός χρώματος
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
