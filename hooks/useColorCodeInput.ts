import { useCallback } from "react";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";

interface UseColorCodeInputProps {
  isSecondary?: boolean;
}

export function useColorCodeInput({
  isSecondary = false,
}: UseColorCodeInputProps = {}) {
  const { colorSelectionState, setColorSelectionState } =
    useColorSelectionStore();

  const index = isSecondary ? 1 : 0;
  const current = colorSelectionState[index];
  const colorValue = current?.colorValue || "";
  const shouldShow = current && current.selectedColorCompany !== null;

  const handleChangeColorValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const c = (event.target as HTMLInputElement).value;
      const next = [...colorSelectionState];
      if (next[index]) {
        next[index] = { ...next[index], colorValue: c };
        setColorSelectionState(next);
      }
    },
    [colorSelectionState, setColorSelectionState, index]
  );

  return {
    colorValue,
    shouldShow,
    handleChangeColorValue,
  };
}

