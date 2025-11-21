import React from "react";
import ColorTypeSelections from "./ColorTypeSelections";
import ColorCompany from "./ColorCompany";
import ColorOptions from "./ColorOptions";
import ColorCodeInput from "./ColorCodeInput";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useOrderOptions } from "@/hooks/useOrderOptions";

// Constants
export const profilColorsType = {
  BLANK: { choiseLabel: "blank", colorType: 0 },
  WHITE: { choiseLabel: "white", colorType: 1 },
  COLOR: { choiseLabel: "color", colorType: 2 },
  DUAL_COLOR: { choiseLabel: "dual_color", colorType: 3 },
};

type Props = {
  isDisabled: boolean;
};

export default function OrderOptions({ isDisabled }: Props) {
  const { colorSelectionState, getTitle } = useOrderOptions();

  console.log(
    "current color selection store state",
    useColorSelectionStore.getState()
  );
  console.log(
    "current order table store state",
    useOrderTableStore.getState()
  );




  return (
    <div className="w-full space-y-6 ">
      <ColorOptions isDisabled={isDisabled} />
      {Array.isArray(colorSelectionState) &&
        colorSelectionState.map((_, index) => {
          const isSecondary = index === 1;
          const selectedTrdpgroup = colorSelectionState[index]?.selectedTrdpgroup;
          return (
            <div key={index} className="space-y-4 flex items-baseline gap-4">
              <div className="flex items-baseline gap-4">
                <ColorCompany isSecondary={isSecondary} title={getTitle(index)} />
              </div>
              <div className="flex items-baseline gap-4">
                {selectedTrdpgroup === 1 ? (
                  <ColorTypeSelections isSecondary={isSecondary} />
                ) : (
                  <ColorCodeInput isSecondary={isSecondary} />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};


