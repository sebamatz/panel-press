import { useCallback, useEffect } from "react";
import { fetchColorCompanies } from "@/api/colors";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { profilColorsType } from "@/components/colors-selection/ProfileColorOptions";

interface UseColorCompanyProps {
  isSecondary?: boolean;
}

interface ColorCompanyData {
  trdr: number;
  name: string;
  trdpgroup: number;
}

export function useColorCompany({ isSecondary = false }: UseColorCompanyProps = {}) {
  const {
    profilColors,
    colorCompanies,
    setColorSelectionState,
    setColorCompanies,
    colorSelectionState,
  } = useColorSelectionStore();

  const getColorCompanies = useCallback(async () => {
    const data = await fetchColorCompanies();
    const colorCompanies = data.map(
      (item: { trdr: number; name: string; trdpgroup: number }) => ({
        trdr: item.trdr,
        name: item.name,
        trdpgroup: item.trdpgroup,
      })
    );
    setColorCompanies(colorCompanies);
  }, [setColorCompanies]);

  useEffect(() => {
    if (
      profilColors === profilColorsType.COLOR.colorType.toString() ||
      profilColors === profilColorsType.DUAL_COLOR.colorType.toString()
    ) {
      getColorCompanies();
    }
  }, [getColorCompanies, profilColors]);

  const handleChangeCompany = useCallback(
    (value: string) => {
      const company = colorCompanies?.find(
        (company) => (company as unknown as ColorCompanyData).trdr === Number(value)
      ) as unknown as ColorCompanyData | undefined;
      const index = isSecondary ? 1 : 0;
      const newState = [...colorSelectionState];
      newState[index] = {
        ...newState[index],
        colorManifacturerValue:{ ccCPOUDRAID: "", sky: "" },
        selectedColorCompany: company?.trdr || null,
        selectedTrdpgroup: company?.trdpgroup || null,
      };
      console.log("newState", newState);
      setColorSelectionState(newState);
    },
    [colorCompanies, colorSelectionState, isSecondary, setColorSelectionState]
  );

  const selectedCompanyValue =
    colorSelectionState[isSecondary ? 1 : 0]?.selectedColorCompany?.toString() ||
    "";

  const shouldShow = colorCompanies && colorCompanies.length > 0;

  return {
    colorCompanies,
    selectedCompanyValue,
    handleChangeCompany,
    shouldShow,
  };
}

