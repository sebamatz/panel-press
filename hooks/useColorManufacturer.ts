import { useCallback } from "react";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";

interface UseColorManufacturerProps {
  isSecondary?: boolean;
}

export function useColorManufacturer({
  isSecondary = false,
}: UseColorManufacturerProps = {}) {
  const { colorSelectionState, setColorSelectionState } =
    useColorSelectionStore();

  const index = isSecondary ? 1 : 0;
  const current = colorSelectionState[index];
  const manifacturer = current?.manifacturer || [];
  const selectedManifacturer = current?.selectedManifacturer || "";

  const handleChangeManifacturer = useCallback(
    (value: string) => {
      const newState = [...colorSelectionState];
      newState[index] = {
        ...newState[index],
        selectedManifacturer: value,
        colorData: [],
      };
      setColorSelectionState(newState);
    },
    [colorSelectionState, setColorSelectionState, index]
  );

  return {
    manifacturer,
    selectedManifacturer,
    handleChangeManifacturer,
  };
}

