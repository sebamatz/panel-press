import { useCallback, useEffect, useRef } from "react";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import {
  fetchColorManufacturers,
  fetchColorsByManufacturer,
  fetchColorTypes,
} from "@/api/colors";

interface UseColorTypeSelectionsProps {
  isSecondary?: boolean;
}

export function useColorTypeSelections({
  isSecondary = false,
}: UseColorTypeSelectionsProps = {}) {
  const { setColorTypes, colorSelectionState, setColorSelectionState } =
    useColorSelectionStore();

  const profilColors = useColorSelectionStore((state) => state.profilColors);
  const colorTypes = useColorSelectionStore((state) => state.colorTypes);

  const index = isSecondary ? 1 : 0;
  const lastFetchedProfilColors = useRef<string>("");

  const currentState = colorSelectionState[index];

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

  // Fetch colors when manufacturer and color type are selected
  useEffect(() => {
    const current = colorSelectionState[index];
    if (current?.selectedManifacturer && current?.colorType !== "3") {
      handleGetColor();
    }
  }, [
    index,
    colorSelectionState[index]?.selectedManifacturer,
    colorSelectionState[index]?.colorType,
    handleGetColor,
  ]);

  // Fetch color types when profilColors changes (only from primary instance)
  useEffect(() => {
    // Only fetch color types once from the primary instance to avoid duplicate API calls
    if (isSecondary || !profilColors) return;

    // Skip if we've already fetched for this profilColors value
    if (lastFetchedProfilColors.current === profilColors) return;

    const fetchColorTypesData = async () => {
      const colortypes = await fetchColorTypes(profilColors);
      // Store available color types globally in the store
      setColorTypes(colortypes);
      lastFetchedProfilColors.current = profilColors;
    };
    fetchColorTypesData();
  }, [profilColors, setColorTypes, isSecondary]);

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
  }, [
    index,
    colorSelectionState[index]?.colorType,
    getManifacturers,
    setColorSelectionState,
    colorSelectionState,
  ]);

  const selectedTrdpgroup = currentState?.selectedTrdpgroup;
  const currentColorType = currentState?.colorType;
  const selectedManifacturer = currentState?.selectedManifacturer;

  const shouldShowColorTypeSelection = selectedTrdpgroup === 1;
  const shouldShowColorCodeInputOnly = selectedTrdpgroup !== 1;

  const shouldShowColorCodeInput = currentColorType === "3";

  // If color type is 3 or 4, don't show manufacturer

  const shouldShowManufacturer =
    shouldShowColorTypeSelection &&
    currentColorType &&
    currentColorType !== "3" &&
    currentColorType !== "4";

  // If color type is 3 or 4, don't show manufacturer colors
  const shouldShowManufacturerColors =
    shouldShowColorTypeSelection &&
    selectedManifacturer &&
    currentColorType !== "3" &&
    currentColorType !== "4";

  return {
    colorTypes,
    currentColorType,
    selectedManifacturer,
    handleChangeColorType,
    shouldShowColorTypeSelection,
    shouldShowColorCodeInputOnly,
    shouldShowColorCodeInput,
    shouldShowManufacturer,
    shouldShowManufacturerColors,
  };
}
