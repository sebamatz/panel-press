import { ColorSelectionState } from "./types";




import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getItems } from "@/api/fetch";
import { companySettings } from "@/config";
import { fetchColorManufacturers, fetchColorTypes } from "@/api/colors";
import { bOption } from "@/api/utils";
import { profilColorsType } from "@/components/colors-selection/OrderOptions";
import { ColorManufacturer } from "./types";





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

export const useColorSelectionStore = create<ColorSelectionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      colorCompanies: [],
      profilColors: "",
      colorTypes: [],
      colorSelectionState: [],

      // Primary color state
      primarySelectedTrdpgroup: null,
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
              : profilColors === profilColorsType.DUAL_COLOR.colorType.toString()
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
      setColorSelectionState: (colorSelectionState) => set({ colorSelectionState }),


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
        set({
          colorCompanies: [],
          profilColors: "",
          colorTypes: [],

          // Reset primary color state
          primarySelectedTrdpgroup: null,
          primaryManifacturer: [],
          primaryColorType: "",
          primarySelectedColorCompany: null,
          primaryColorValue: "",
          primarySelectedManifacturer: "",
          primaryColorData: [],
          primaryColorManifacturerValue: "",

          // Reset secondary color state
          secondarySelectedTrdpgroup: null,
          secondaryManifacturer: [],
          secondaryColorType: "",
          secondarySelectedColorCompany: null,
          secondaryColorValue: "",
          secondarySelectedManifacturer: "",
          secondaryColorData: [],
          secondaryColorManifacturerValue: "",
        });
      },
    }),
    {
      name: "color-selection-store",
    }
  )
);
