import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";

export default function ColorCodeInput({ isSecondary = false }) {
  const { colorSelectionState, setColorSelectionState } = useColorSelectionStore();
  const index = isSecondary ? 1 : 0;
  const current = colorSelectionState[index];
  const handleChangeColorValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const c = (event.target as HTMLInputElement).value;
    const next = [...colorSelectionState];
    if (next[index]) {
      next[index] = { ...next[index], colorValue: c };
      setColorSelectionState(next);
    }
  };

  if (!current || !current.selectedColorCompany) return null;

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
          value={current?.colorValue || ""}
          placeholder="Εισάγετε κωδικό..."
        />
      </div>
      
    </div>
  );
}
