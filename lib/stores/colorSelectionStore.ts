import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getItems } from '@/api/fetch'
import { company } from '@/config'

export interface IColorData {
  ccCPOUDRAID: number
  sku: string
}

export interface ColorType {
  id: number
  name: string
}

export interface ColorCompany {
  trdr: number
  name: string
  trdpgroup: number
}

export interface Manufacturer {
  trdr: number
  name: string
}

interface ColorSelectionState {
  // Shared State
  colorCompanies: ColorCompany[]
  profilColors: string
  colorTypes: ColorType[]
  
  // Primary Color State (for single color or first color in dual)
  primarySelectedTrdpgroup: number | null
  primaryManifacturer: Manufacturer[]
  primaryColorType: string
  primarySelectedColorCompany: number | null
  primaryColorValue: string
  primarySelectedManifacturer: string
  primaryColorData: IColorData[]
  primaryColorManifacturerValue: string
  
  // Secondary Color State (for second color in dual)
  secondarySelectedTrdpgroup: number | null
  secondaryManifacturer: Manufacturer[]
  secondaryColorType: string
  secondarySelectedColorCompany: number | null
  secondaryColorValue: string
  secondarySelectedManifacturer: string
  secondaryColorData: IColorData[]
  secondaryColorManifacturerValue: string

  // Actions
  setProfilColors: (profilColors: string) => void
  setColorCompanies: (colorCompanies: ColorCompany[]) => void
  setColorTypes: (colorTypes: ColorType[]) => void
  
  // Primary color actions
  setPrimarySelectedTrdpgroup: (selectedTrdpgroup: number | null) => void
  setPrimaryManifacturer: (manifacturer: Manufacturer[]) => void
  setPrimaryColorType: (colorType: string) => void
  setPrimarySelectedColorCompany: (selectedColorCompany: number | null) => void
  setPrimaryColorValue: (colorValue: string) => void
  setPrimarySelectedManifacturer: (selectedManifacturer: string) => void
  setPrimaryColorData: (colorData: IColorData[]) => void
  setPrimaryColorManifacturerValue: (colorManifacturerValue: string) => void
  
  // Secondary color actions
  setSecondarySelectedTrdpgroup: (selectedTrdpgroup: number | null) => void
  setSecondaryManifacturer: (manifacturer: Manufacturer[]) => void
  setSecondaryColorType: (colorType: string) => void
  setSecondarySelectedColorCompany: (selectedColorCompany: number | null) => void
  setSecondaryColorValue: (colorValue: string) => void
  setSecondarySelectedManifacturer: (selectedManifacturer: string) => void
  setSecondaryColorData: (colorData: IColorData[]) => void
  setSecondaryColorManifacturerValue: (colorManifacturerValue: string) => void

  // API Actions
  fetchColorData: (boption: number) => Promise<void>
  fetchColorTypes: () => Promise<void>
  fetchManufacturers: (isSecondary?: boolean) => Promise<void>
  fetchColorCompanies: () => Promise<void>
  fetchColors: (params: {
    colorType: string
    selectedManifacturer: string
    colorValue: string
  }, isSecondary?: boolean) => Promise<void>

  // Reset actions
  resetPrimaryColorType: () => void
  resetPrimaryManufacturer: () => void
  resetPrimaryColorValue: () => void
  resetPrimaryColorData: () => void
  resetSecondaryColorType: () => void
  resetSecondaryManufacturer: () => void
  resetSecondaryColorValue: () => void
  resetSecondaryColorData: () => void
  resetAll: () => void
}

export const useColorSelectionStore = create<ColorSelectionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      colorCompanies: [],
      profilColors: '',
      colorTypes: [],
      
      // Primary color state
      primarySelectedTrdpgroup: null,
      primaryManifacturer: [],
      primaryColorType: '',
      primarySelectedColorCompany: null,
      primaryColorValue: '',
      primarySelectedManifacturer: '',
      primaryColorData: [],
      primaryColorManifacturerValue: '',
      
      // Secondary color state
      secondarySelectedTrdpgroup: null,
      secondaryManifacturer: [],
      secondaryColorType: '',
      secondarySelectedColorCompany: null,
      secondaryColorValue: '',
      secondarySelectedManifacturer: '',
      secondaryColorData: [],
      secondaryColorManifacturerValue: '',

      // Basic setters
      setProfilColors: (profilColors) => set({ profilColors }),
      setColorCompanies: (colorCompanies) => set({ colorCompanies }),
      setColorTypes: (colorTypes) => set({ colorTypes }),
      
      // Primary color setters
      setPrimarySelectedTrdpgroup: (primarySelectedTrdpgroup) => set({ primarySelectedTrdpgroup }),
      setPrimaryManifacturer: (primaryManifacturer) => set({ primaryManifacturer }),
      setPrimaryColorType: (primaryColorType) => set({ primaryColorType }),
      setPrimarySelectedColorCompany: (primarySelectedColorCompany) => set({ primarySelectedColorCompany }),
      setPrimaryColorValue: (primaryColorValue) => set({ primaryColorValue }),
      setPrimarySelectedManifacturer: (primarySelectedManifacturer) => set({ primarySelectedManifacturer }),
      setPrimaryColorData: (primaryColorData) => set({ primaryColorData }),
      setPrimaryColorManifacturerValue: (primaryColorManifacturerValue) => set({ primaryColorManifacturerValue }),
      
      // Secondary color setters
      setSecondarySelectedTrdpgroup: (secondarySelectedTrdpgroup) => set({ secondarySelectedTrdpgroup }),
      setSecondaryManifacturer: (secondaryManifacturer) => set({ secondaryManifacturer }),
      setSecondaryColorType: (secondaryColorType) => set({ secondaryColorType }),
      setSecondarySelectedColorCompany: (secondarySelectedColorCompany) => set({ secondarySelectedColorCompany }),
      setSecondaryColorValue: (secondaryColorValue) => set({ secondaryColorValue }),
      setSecondarySelectedManifacturer: (secondarySelectedManifacturer) => set({ secondarySelectedManifacturer }),
      setSecondaryColorData: (secondaryColorData) => set({ secondaryColorData }),
      setSecondaryColorManifacturerValue: (secondaryColorManifacturerValue) => set({ secondaryColorManifacturerValue }),

      // API Actions
      fetchColorData: async (boption: number) => {
        try {
          switch (boption) {
            case 30:
              const data30 = await getItems({ BOption: 30, Company: company })
              const colorTypes = data30.map((item: { id: number; name: string }) => ({
                id: item.id,
                name: item.name,
              }))
              set({ colorTypes })
              break
            case 40:
              const data40 = await getItems({ BOption: 40, Company: company })
              const manufacturers = data40.map((item: { id: number; code: string }) => ({
                trdr: item.id,
                name: item.code,
              }))
              // Set for primary manufacturer (legacy support)
              set({ primaryManifacturer: manufacturers })
              break
            case 50:
              const data50 = await getItems({ BOption: 50, Company: company })
              const manufacturers50 = data50.map((item: { id: number; code: string }) => ({
                trdr: item.id,
                name: item.code,
              }))
              // Set for primary manufacturer (legacy support)
              set({ primaryManifacturer: manufacturers50 })
              break
            case 60:
              const data60 = await getItems({ BOption: 60, Company: 10 })
              const colorCompanies = data60.map((item: { trdr: number; name: string; trdpgroup: number }) => ({
                trdr: item.trdr,
                name: item.name,
                trdpgroup: item.trdpgroup,
              }))
              set({ colorCompanies })
              break
            default:
              break
          }
        } catch (error) {
          console.error('Error fetching color data:', error)
        }
      },

      fetchColorTypes: async () => {
        await get().fetchColorData(30)
      },

      fetchManufacturers: async (isSecondary = false) => {
        const state = get()
        const colorType = isSecondary ? state.secondaryColorType : state.primaryColorType
        if (colorType === '3') {
          const data50 = await getItems({ BOption: 50, Company: company })
          const manufacturers = data50.map((item: { id: number; code: string }) => ({
            trdr: item.id,
            name: item.code,
          }))
          if (isSecondary) {
            set({ secondaryManifacturer: manufacturers })
          } else {
            set({ primaryManifacturer: manufacturers })
          }
        } else {
          const data40 = await getItems({ BOption: 40, Company: company })
          const manufacturers = data40.map((item: { id: number; code: string }) => ({
            trdr: item.id,
            name: item.code,
          }))
          if (isSecondary) {
            set({ secondaryManifacturer: manufacturers })
          } else {
            set({ primaryManifacturer: manufacturers })
          }
        }
      },

      fetchColorCompanies: async () => {
        await get().fetchColorData(60)
      },

      fetchColors: async ({ colorType, selectedManifacturer, colorValue }, isSecondary = false) => {
        try {
          const data: IColorData[] = await getItems({
            BOption: 50,
            Company: company,
            id: Number(colorType) === 3 ? 20 : Number(selectedManifacturer),
            LastId: Number(colorType),
            SearchValue: colorValue,
          })
          if (isSecondary) {
            set({ secondaryColorData: data })
          } else {
            set({ primaryColorData: data })
          }
        } catch (error) {
          console.error('Error fetching colors:', error)
        }
      },

      // Reset actions
      resetPrimaryColorType: () => {
        set({
          primaryColorType: '',
          primaryManifacturer: [],
          primaryColorData: [],
          primaryColorManifacturerValue: '',
          primaryColorValue: '',
        })
      },

      resetPrimaryManufacturer: () => {
        set({
          primaryManifacturer: [],
          primaryColorData: [],
          primaryColorManifacturerValue: '',
          primaryColorValue: '',
        })
      },

      resetPrimaryColorValue: () => {
        set({ primaryColorValue: '' })
      },

      resetPrimaryColorData: () => {
        set({ primaryColorData: [], primaryColorManifacturerValue: '' })
      },

      resetSecondaryColorType: () => {
        set({
          secondaryColorType: '',
          secondaryManifacturer: [],
          secondaryColorData: [],
          secondaryColorManifacturerValue: '',
          secondaryColorValue: '',
        })
      },

      resetSecondaryManufacturer: () => {
        set({
          secondaryManifacturer: [],
          secondaryColorData: [],
          secondaryColorManifacturerValue: '',
          secondaryColorValue: '',
        })
      },

      resetSecondaryColorValue: () => {
        set({ secondaryColorValue: '' })
      },

      resetSecondaryColorData: () => {
        set({ secondaryColorData: [], secondaryColorManifacturerValue: '' })
      },

      resetAll: () => {
        set({
          colorCompanies: [],
          profilColors: '',
          colorTypes: [],
          
          // Reset primary color state
          primarySelectedTrdpgroup: null,
          primaryManifacturer: [],
          primaryColorType: '',
          primarySelectedColorCompany: null,
          primaryColorValue: '',
          primarySelectedManifacturer: '',
          primaryColorData: [],
          primaryColorManifacturerValue: '',
          
          // Reset secondary color state
          secondarySelectedTrdpgroup: null,
          secondaryManifacturer: [],
          secondaryColorType: '',
          secondarySelectedColorCompany: null,
          secondaryColorValue: '',
          secondarySelectedManifacturer: '',
          secondaryColorData: [],
          secondaryColorManifacturerValue: '',
        })
      },
    }),
    {
      name: 'color-selection-store',
    }
  )
)
