import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { profilColorsType } from "@/components/colors-selection/ProfileColorOptions";

export function useOrderOptions() {
  const { colorSelectionState, profilColors } = useColorSelectionStore();

  const getTitle = (index: number) => {
    if (
      index === 0 &&
      profilColors === profilColorsType.DUAL_COLOR.colorType.toString()
    )
      return "Μροστά πλευρά";
    if (
      index === 1 &&
      profilColors === profilColorsType.DUAL_COLOR.colorType.toString()
    )
      return "Πίσω πλευρά";
    return "Επιλογή Βαφείου";
  };

  return {
    colorSelectionState,
    profilColors,
    getTitle,
  };
}

