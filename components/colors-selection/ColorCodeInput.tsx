import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useColorCodeInput } from "@/hooks/useColorCodeInput";

export default function ColorCodeInput({ isSecondary = false }) {
  const { colorValue, shouldShow, handleChangeColorValue } =
    useColorCodeInput({ isSecondary });

  if (!shouldShow) return null;



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
          value={colorValue}
          placeholder="Εισάγετε κωδικό..."
        />
      </div>
      
    </div>
  );
}
