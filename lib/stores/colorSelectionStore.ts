import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getItems } from "@/api/fetch";
import { companySettings } from "@/config";
import { fetchColorManufacturers, fetchColorTypes } from "@/api/colors";
import { bOption } from "@/api/utils";
import { profilColorsType } from "@/components/colors-selection/OrderOptions";
import { ColorManufacturer } from "./types";

export interface IColorData {
  ccCPOUDRAID: number;
  sku: string;
}

export interface ColorType {
  id: number;
  name: string;
}

export interface ColorCompany {
  id: number;
  code: string;
  name: string;
  trdpgroup: number;
}

export interface Manufacturer {
  id: number;
  code: string;
  name: string;
}

interface ColorSelectionState {
  // Shared State
  colorCompanies: ColorCompany[];
  profilColors: string;
  colorTypes: ColorType[];

  // Unified selection items (one for COLOR, two for DUAL_COLOR)
  colorSelectionState: ColorSelectionItem[];

  // Primary Color State (for single color or first color in dual)
  primarySelectedTrdpgroup: number | null;
  primaryManifacturer: Manufacturer[];
  primaryColorType: string;
  primarySelectedColorCompany: number | null;
  primaryColorValue: string;
  primarySelectedManifacturer: string;
  primaryColorData: IColorData[];
  primaryColorManifacturerValue: string;

  // Secondary Color State (for second color in dual)
  secondarySelectedTrdpgroup: number | null;
  secondaryManifacturer: Manufacturer[];
  secondaryColorType: string;
  secondarySelectedColorCompany: number | null;
  secondaryColorValue: string;
  secondarySelectedManifacturer: string;
  secondaryColorData: IColorData[];
  secondaryColorManifacturerValue: string;

  // Actions
  setProfilColors: (profilColors: string) => void;
  setColorCompanies: (colorCompanies: ColorCompany[]) => void;
  setColorTypes: (colorTypes: ColorType[]) => void;
  setColorSelectionState: (colorSelectionState: ColorSelectionItem[]) => void;

  // Primary color actions
  setPrimarySelectedTrdpgroup: (
    selectedTrdpgroup: number | null,
    isSecondary?: boolean
  ) => void;
  setPrimaryManifacturer: (manifacturer: Manufacturer[]) => void;
  setPrimaryColorType: (colorType: string) => void;
  setPrimarySelectedColorCompany: (selectedColorCompany: number | null) => void;
  setPrimaryColorValue: (colorValue: string) => void;
  setPrimarySelectedManifacturer: (selectedManifacturer: string) => void;
  setPrimaryColorData: (colorData: IColorData[]) => void;
  setPrimaryColorManifacturerValue: (colorManifacturerValue: string) => void;

  // Secondary color actions
  setSecondarySelectedTrdpgroup: (selectedTrdpgroup: number | null) => void;
  setSecondaryManifacturer: (manifacturer: Manufacturer[]) => void;
  setSecondaryColorType: (colorType: string) => void;
  setSecondarySelectedColorCompany: (
    selectedColorCompany: number | null
  ) => void;
  setSecondaryColorValue: (colorValue: string) => void;
  setSecondarySelectedManifacturer: (selectedManifacturer: string) => void;
  setSecondaryColorData: (colorData: IColorData[]) => void;
  setSecondaryColorManifacturerValue: (colorManifacturerValue: string) => void;

  // API Actions
  fetchColorTypes: () => Promise<void>;
  fetchManufacturers: (isSecondary?: boolean) => Promise<void>;
  fetchColorCompanies: () => Promise<void>;
  fetchColors: (
    params: {
      colorType: string;
      selectedManifacturer: string;
      colorValue: string;
    },
    isSecondary?: boolean
  ) => Promise<void>;

  // Reset actions
  resetPrimaryColorType: () => void;
  resetPrimaryManufacturer: () => void;
  resetPrimaryColorValue: () => void;
  resetPrimaryColorData: () => void;
  resetSecondaryColorType: () => void;
  resetSecondaryManufacturer: () => void;
  resetSecondaryColorValue: () => void;
  resetSecondaryColorData: () => void;
  resetAll: () => void;
}

export interface ColorSelectionItem {
  selectedTrdpgroup: number | null;
  manifacturer: ColorManufacturer[];
  colorType: string;
  selectedColorCompany: number | null;
  colorValue: string;
  selectedManifacturer: string;
  colorData: IColorData[];
  colorManifacturerValue: {
    ccCPOUDRAID: string;
    sky: string;
  };
}

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
        set((state) => ({
          ...state,
          profilColors,
          colorSelectionState:
            profilColors === profilColorsType.COLOR
              ? [{ ...colorSelectionItem }]
              : profilColors === profilColorsType.DUAL_COLOR
              ? [{ ...colorSelectionItem }, { ...colorSelectionItem }]
              : [],
        })),
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
