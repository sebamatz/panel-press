import { useCallback, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import ColorCodeInput from "./ColorCodeInput";
import ColorManufacturer from "./ColorManufacturer";
import ManifacturerColors from "./ManifacturerColors";
import { fetchColorManufacturers, fetchColorsByManufacturer, fetchColorTypes } from "@/api/colors";

export default function ColorSelections({ isSecondary = false }) {
  const {
    colorTypes,
    setColorTypes,
    colorSelectionState,
    setColorSelectionState,
  } = useColorSelectionStore();

  const index = isSecondary ? 1 : 0;

  const handleChangeColorType = useCallback(
    (value: string) => {
      //reset all values
      const newState = [...colorSelectionState];
      newState[index] = {
        ...newState[index],
        colorType: value,
        // Clear dependent selections when color type changes
        selectedManifacturer: "",
        manifacturer: [],
        colorValue: "",
        colorData: [],
      };
      setColorSelectionState(newState);
    },
    [colorSelectionState, setColorSelectionState, index]
  );

  const handleGetColor = useCallback(async () => {
    const current = colorSelectionState[index];
    if (!current) return;
    const colors = await fetchColorsByManufacturer({
      colorType: current.colorType,
      selectedManifacturer: current.selectedManifacturer,
      colorValue: current.colorValue,
    });
    const prevColors = current.colorData || [];
    const isSame = JSON.stringify(prevColors) === JSON.stringify(colors);
    if (isSame) return;
    const newState = [...colorSelectionState];
    newState[index] = { ...newState[index], colorData: colors };
    setColorSelectionState(newState);
  }, [colorSelectionState, setColorSelectionState, index]);


  const getManifacturers = useCallback(async () => {
    const manufacturers = await fetchColorManufacturers();
    const current = colorSelectionState[index];
    const prev = current?.manifacturer || [];
    const isSame = JSON.stringify(prev) === JSON.stringify(manufacturers);
    if (isSame) return;
    const newState = [...colorSelectionState];
    newState[index] = { ...newState[index], manifacturer: manufacturers };
    setColorSelectionState(newState);
  }, [colorSelectionState, setColorSelectionState, index]);

  const getColortypes = useCallback(async () => {
    const colortypes = await fetchColorTypes();
    // Store available color types globally in the store
    setColorTypes(colortypes);
  }, [setColorTypes]);

  useEffect(() => {
    const current = colorSelectionState[index];
    if (current?.selectedManifacturer && current?.colorType !== "3") {
      handleGetColor();
    }
  }, [index, colorSelectionState[index]?.selectedManifacturer, colorSelectionState[index]?.colorType, handleGetColor]);

  // Initialize color types on component mount
  useEffect(() => {
    if (!colorTypes || colorTypes.length === 0) {
      getColortypes();
    }
  }, [getColortypes, colorTypes]);

  // Fetch manufacturers when color type changes
  useEffect(() => {
    const current = colorSelectionState[index];
    if (!current) return;
    if (current.colorType) {
      if (current.colorType !== "3") {
        getManifacturers();
      } else {
        // Clear manufacturer-related selections when manual code input is selected
        // Only update if values are not already cleared to avoid unnecessary state changes
        const needsClear =
          (current.manifacturer && current.manifacturer.length > 0) ||
          !!current.selectedManifacturer ||
          (current.colorData && current.colorData.length > 0);

        if (needsClear) {
          const newState = [...colorSelectionState];
          newState[index] = {
            ...newState[index],
            manifacturer: [],
            selectedManifacturer: "",
            colorData: [],
          };
          setColorSelectionState(newState);
        }
      }
    }
  }, [index, colorSelectionState[index]?.colorType, getManifacturers, setColorSelectionState]);

  return colorSelectionState[isSecondary ? 1 : 0]?.selectedTrdpgroup === 1 ? ( 
    <div className="space-y-4 w-full">
      <div className="flex items-baseline gap-4">
        {/* Color Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="color-type-select" className="text-sm font-medium">
            Τύπος Χρώματος
          </Label>
          <Select value={colorSelectionState[isSecondary ? 1 : 0]?.colorType} onValueChange={handleChangeColorType}>
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
        {colorSelectionState[isSecondary ? 1 : 0]?.colorType === "3" ? <ColorCodeInput /> : <ColorManufacturer isSecondary={isSecondary} />}
        {/* Color Selection Combobox */}
        {colorSelectionState[isSecondary ? 1 : 0]?.selectedManifacturer && colorSelectionState[isSecondary ? 1 : 0]?.colorType !== "3" && <ManifacturerColors isSecondary={isSecondary} />}
      </div>
    </div>
  ) : (
    <ColorCodeInput />
  );
}
