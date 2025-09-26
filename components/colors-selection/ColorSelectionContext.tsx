import { createContext, useContext, useState, useEffect } from "react";
import { getItems } from "@/api/fetch";
import { company } from "@/config";

interface IColorData {
  ccCPOUDRAID: number;
  sku: string;
}
interface ColorSelection {
  colorSelection: ColorSelection | null;
  setColorSelection: (colorSelection: ColorSelection) => void;
  colorCompanies: { trdr: number; name: string; trdpgroup: number }[];
  profilColors: string;
  setProfilColors: (profilColors: string) => void;
  setColorCompanies: (colorCompanies: string) => void;
  selectedTrdpgroup: number | null;
  setSelectedTrdpgroup: (selectedTrdpgroup: number | null) => void;
  colorTypes: { id: number; name: string }[];
  manifacturer: { trdr: number; name: string }[];
  setColorTypes: (colorTypes: { id: number; name: string }[]) => void;
  setManifacturer: (manifacturer: { trdr: number; name: string }[]) => void;
  colorType: string;
  setColorType: (colorType: string) => void;
  selectedColorCompany: number | null;
  setSelectedColorCompany: (selectedColorCompany: number | null) => void;
  colorValue: string;
  setColorValue: (colorValue: string) => void;
  selectedManifacturer: string;
  setSelectedManifacturer: (selectedManifacturer: string) => void;
  colorData: IColorData[];
  setColorData: (colorData: IColorData[]) => void;
  colorManifacturerValue: string;
  setColorManifacturerValue: (colorManifacturerValue: string) => void;
}

const initialColorSelection: ColorSelection = {
  colorSelection: null,
  setColorSelection: () => {},
  colorCompanies: [],
  profilColors: "",
  setProfilColors: () => {},
  setColorCompanies: () => {},
  selectedTrdpgroup: null,
  setSelectedTrdpgroup: () => {},
  colorTypes: [],
  manifacturer: [],
  setColorTypes: () => {},
  setManifacturer: () => {},
  colorType: "",
  setColorType: () => {},
  selectedColorCompany: null,
  setSelectedColorCompany: () => {},
  colorValue: "",
  setColorValue: () => {},
  selectedManifacturer: "",
  setSelectedManifacturer: () => {},
  colorData: [],
  setColorData: () => {},
  colorManifacturerValue: "",
  setColorManifacturerValue: () => {},
};

export const ColorSelectionContext = createContext<ColorSelection>(
  initialColorSelection
);

export const useColorSelection = () => {
  return useContext(ColorSelectionContext);
};

export const ColorSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [colorSelection, setColorSelection] = useState<ColorSelection | null>(
    null
  );
  const [profilColors, setProfilColors] = useState<string>("");
  const [colorCompanies, setColorCompanies] = useState<string | null>(null);
  const [selectedTrdpgroup, setSelectedTrdpgroup] = useState<number | null>(
    null
  );
  const [colorTypes, setColorTypes] = useState<{ id: number; name: string }[]>(
    []
  );
  const [manifacturer, setManifacturer] = useState<
    { trdr: number; name: string }[]
  >([]);
  const [colorType, setColorType] = useState<string>("");
  const [selectedColorCompany, setSelectedColorCompany] = useState<number | null>(null);
  const [colorValue, setColorValue] = useState<string>("");
  const [selectedManifacturer, setSelectedManifacturer] = useState<string>("");
  const [colorData, setColorData] = useState<IColorData[]>([]);
  const [colorManifacturerValue, setColorManifacturerValue] = useState<string>("");
  const value = {
    colorSelection,
    setColorSelection,
    colorCompanies,
    profilColors,
    setProfilColors,
    setColorCompanies,
    selectedTrdpgroup,
    setSelectedTrdpgroup,
    colorTypes,
    manifacturer,
    setColorTypes,
    setManifacturer,
    colorType,
    setColorType,
    selectedColorCompany,
    setSelectedColorCompany,
    colorValue,
    setColorValue,
    selectedManifacturer,
    setSelectedManifacturer,
    colorData,
    setColorData,
    colorManifacturerValue,
    setColorManifacturerValue,
  };

  const handleGetCollorData = async (boption: number) => {
    switch (boption) {
      case 30:
        const data30 = await getItems({ BOption: 30, Company: company });
        setColorTypes(
          data30.map((item: { id: number; name: string }) => ({
            id: item.id,
            name: item.name,
          }))
        );
        break;
      case 40:
        const data40 = await getItems({ BOption: 40, Company: company });
        setManifacturer(
          data40.map((item: { id: number; code: string }) => ({
            trdr: item.id,
            name: item.code,
          }))
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleGetCollorData(30);
  }, []);

  useEffect(() => {
    if (colorType === "3") {
      handleGetCollorData(50);
      return;
    } else {
      handleGetCollorData(40);
    }
  }, [colorType]);

  console.log("value", value);

  return (
    <ColorSelectionContext.Provider value={value}>
      {children}
    </ColorSelectionContext.Provider>
  );
};
