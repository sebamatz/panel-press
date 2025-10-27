import React, { useState } from "react";
import ColorSelections from "./ColorSelections";
import ColorCompany from "./ColorCompany";
import ColorOptions from "./ColorOptions";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import ColorCodeInput from "./ColorCodeInput";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";

// Constants
export const profilColorsType = {
  BLANK: "blank",
  WHITE: "white", 
  COLOR: "color",
  DUAL_COLOR: "dual_color"
};

type Props = {
  isDisabled: boolean;
};

export default function OrderOptions({ isDisabled }: Props) {
  const { 
    colorSelectionState,
  } = useColorSelectionStore();
 

  console.log("current color selection store state", useColorSelectionStore.getState())
  console.log("current order table store state", useOrderTableStore.getState());




  return (
    <div className="w-full space-y-6 ">
      <ColorOptions isDisabled={isDisabled} />
      {Array.isArray(colorSelectionState) && colorSelectionState.map((_, index) => {
        const isSecondary = index === 1;
        const selectedTrdpgroup = colorSelectionState[index]?.selectedTrdpgroup;
        return (
          <div key={index} className="space-y-4 flex items-baseline gap-4">
            <div className="flex items-baseline gap-4">
              <ColorCompany isSecondary={isSecondary} />
            </div>
            <div className="flex items-baseline gap-4">
              {selectedTrdpgroup === 1 ? (
                <ColorSelections isSecondary={isSecondary} />
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


