import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ColorCodeInput from "./ColorCodeInput";
import ColorManufacturer from "./ColorManufacturer";
import ManifacturerColors from "./ManifacturerColors";
import { useColorTypeSelections } from "@/hooks/useColorTypeSelections";

export default function ColorTypeSelections({ isSecondary = false }) {
  const {
    colorTypes,
    currentColorType,
    handleChangeColorType,
    shouldShowColorTypeSelection,
    shouldShowColorCodeInputOnly,
    shouldShowColorCodeInput,
    shouldShowManufacturer,
    shouldShowManufacturerColors,
  } = useColorTypeSelections({ isSecondary });

  if (shouldShowColorCodeInputOnly) {
    return <ColorCodeInput isSecondary={isSecondary} />;
  }

  return shouldShowColorTypeSelection ? ( 
    <div className="space-y-4 w-full">
      <div className="flex items-baseline gap-4">
        {/* Color Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="color-type-select" className="text-sm font-medium">
            Τύπος Χρώματος
          </Label>
          <Select value={currentColorType || ""} onValueChange={handleChangeColorType}>
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
        {shouldShowColorCodeInput ? (
          <ColorCodeInput isSecondary={isSecondary} />
        ) : (
          shouldShowManufacturer && <ColorManufacturer isSecondary={isSecondary} />
        )}
        {/* Color Selection Combobox */}
        {shouldShowManufacturerColors && (
          <ManifacturerColors isSecondary={isSecondary} />
        )}
      </div>
    </div>
  ) : null;
}
