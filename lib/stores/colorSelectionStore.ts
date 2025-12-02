import { ColorSelectionState } from "./types";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { companySettings } from "@/config";
import { profilColorsType } from "@/components/colors-selection/ProfileColorOptions";

const colorSelectionItem = {
  selectedTrdpgroup: null,
  manifacturer: [],
  colorType: "",
  selectedColorCompany: null,
  colorValue: "",
  selectedManifacturer: "",
  colorData: [],
  colorManifacturerValue: "",
};

const company = companySettings.company;

const initialColorSelectionState: ColorSelectionState = {
  colorCompanies: [],
  profilColors: profilColorsType.WHITE.colorType.toString(),
  colorTypes: [],
  colorSelectionState: [],
  primarySelectedTrdpgroup: null,
  primaryManifacturer: [],
  primaryColorType: "",
  primarySelectedColorCompany: null,
  primaryColorValue: "",
  primarySelectedManifacturer: "",
  primaryColorData: [],
  primaryColorManifacturerValue: "",
  secondarySelectedTrdpgroup: null,
  secondaryManifacturer: [],
  secondaryColorType: "",
  secondarySelectedColorCompany: null,
  secondaryColorValue: "",
  secondarySelectedManifacturer: "",
  secondaryColorData: [],
  secondaryColorManifacturerValue: "",
};

export const useColorSelectionStore = create<ColorSelectionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      colorCompanies: initialColorSelectionState.colorCompanies,
      profilColors: initialColorSelectionState.profilColors,
      colorTypes: initialColorSelectionState.colorTypes,
      colorSelectionState: initialColorSelectionState.colorSelectionState,

      // Primary color state
      primarySelectedTrdpgroup:
        initialColorSelectionState.primarySelectedTrdpgroup,
      primaryManifacturer: [],
      primaryColorType: "",
      primarySelectedColorCompany: null,
      primaryColorValue: "",
      primarySelectedManifacturer: "",
      primaryColorData: [],
      primaryColorManifacturerValue: "",

      // Secondary color state
      secondarySelectedTrdpgroup: null,
      secondaryManifacturer: [],
      secondaryColorType: "",
      secondarySelectedColorCompany: null,
      secondaryColorValue: "",
      secondarySelectedManifacturer: "",
      secondaryColorData: [],
      secondaryColorManifacturerValue: "",

      // Basic setters
      setProfilColors: (profilColors) =>
        set({
          profilColors,
          colorSelectionState:
            profilColors === profilColorsType.COLOR.colorType.toString()
              ? [
                  {
                    ...colorSelectionItem,
                    colorManifacturerValue: { ccCPOUDRAID: "", sky: "" },
                  },
                ]
              : profilColors ===
                profilColorsType.DUAL_COLOR.colorType.toString()
              ? [
                  {
                    ...colorSelectionItem,
                    colorManifacturerValue: { ccCPOUDRAID: "", sky: "" },
                  },
                  {
                    ...colorSelectionItem,
                    colorManifacturerValue: { ccCPOUDRAID: "", sky: "" },
                  },
                ]
              : [],
        }),
      setColorCompanies: (colorCompanies) => set({ colorCompanies }),
      setColorTypes: (colorTypes) => set({ colorTypes }),
      setColorSelectionState: (colorSelectionState) =>
        set({ colorSelectionState }),

      // Reset actions
      resetPrimaryColorType: () => {
        set({
          primaryColorType: "",
          primaryManifacturer: [],
          primaryColorData: [],
          primaryColorManifacturerValue: "",
          primaryColorValue: "",
        });
      },

      resetPrimaryManufacturer: () => {
        set({
          primaryManifacturer: [],
          primaryColorData: [],
          primaryColorManifacturerValue: "",
          primaryColorValue: "",
        });
      },

      resetPrimaryColorValue: () => {
        set({ primaryColorValue: "" });
      },

      resetPrimaryColorData: () => {
        set({ primaryColorData: [], primaryColorManifacturerValue: "" });
      },

      resetSecondaryColorType: () => {
        set({
          secondaryColorType: "",
          secondaryManifacturer: [],
          secondaryColorData: [],
          secondaryColorManifacturerValue: "",
          secondaryColorValue: "",
        });
      },

      resetSecondaryManufacturer: () => {
        set({
          secondaryManifacturer: [],
          secondaryColorData: [],
          secondaryColorManifacturerValue: "",
          secondaryColorValue: "",
        });
      },

      resetSecondaryColorValue: () => {
        set({ secondaryColorValue: "" });
      },

      resetSecondaryColorData: () => {
        set({ secondaryColorData: [], secondaryColorManifacturerValue: "" });
      },

      resetAll: () => {
        set(initialColorSelectionState);
      },
    }),
    {
      name: "color-selection-store",
    }
  )
);
