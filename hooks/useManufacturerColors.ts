import { useCallback, useState } from "react";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";

interface UseManufacturerColorsProps {
  isSecondary?: boolean;
}

export function useManufacturerColors({
  isSecondary = false,
}: UseManufacturerColorsProps = {}) {
  const { colorSelectionState, setColorSelectionState } =
    useColorSelectionStore();

  const index = isSecondary ? 1 : 0;
  const current = colorSelectionState[index];
  const colorData = current?.colorData || [];
  const colorManifacturerValue =
    current?.colorManifacturerValue?.sky || "";

  const [open, setOpen] = useState(false);

  const setColorManifacturerValue = useCallback(
    (value: { ccCPOUDRAID: string; sky: string }) => {
      const newState = [...colorSelectionState];
      newState[index] = {
        ...newState[index],
        colorManifacturerValue: value,
      };
      setColorSelectionState(newState);
    },
    [colorSelectionState, setColorSelectionState, index]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      const selectedColor = colorData.find((color) => color.sku === value);
      setColorManifacturerValue({
        ccCPOUDRAID: selectedColor?.ccCPOUDRAID.toString() || "",
        sky: selectedColor?.sku || "",
      });
    },
    [setColorManifacturerValue, colorData]
  );

  const handleChangeColor = useCallback(
    (value: string) => {
      const selectedColor = colorData.find((color) => color.sku === value);
      setColorManifacturerValue({
        ccCPOUDRAID: selectedColor?.ccCPOUDRAID.toString() || "",
        sky: selectedColor?.sku || "",
      });
      setOpen(false);
    },
    [setColorManifacturerValue, colorData]
  );

  return {
    colorData,
    colorManifacturerValue,
    open,
    setOpen,
    handleInputChange,
    handleChangeColor,
  };
}

