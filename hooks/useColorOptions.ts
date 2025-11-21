import { useEffect, useCallback } from "react";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { profilColorsType } from "@/components/colors-selection/OrderOptions";

export function useColorOptions() {
  const { profilColors, setProfilColors, setColorSelectionState } =
    useColorSelectionStore();

  const handleProfilColors = useCallback(
    (value: string) => {
      setColorSelectionState([]);
      if (value === profilColorsType.WHITE.colorType.toString()) {
        const newState = [
          {
            colorValue: profilColorsType.WHITE.choiseLabel,
            colorManifacturerValue: { ccCPOUDRAID: "", sky: "" },
            selectedTrdpgroup: null,
            manifacturer: [],
            colorType: "",
            selectedColorCompany: null,
            selectedManifacturer: "",
            colorData: [],
            ColorChoice: value,
          },
        ];
        setColorSelectionState(newState);
      } else {
        setColorSelectionState([]);
      }
      setProfilColors(value);
    },
    [setProfilColors, setColorSelectionState]
  );

  useEffect(() => {
    handleProfilColors(profilColorsType.WHITE.colorType.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    profilColors,
    handleProfilColors,
  };
}

