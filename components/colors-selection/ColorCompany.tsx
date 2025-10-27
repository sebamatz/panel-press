"use client";
import { useCallback, useEffect, useState } from "react";
import { fetchColorCompanies } from "@/api/colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { profilColorsType } from "./OrderOptions";
import { bOption } from "@/api/utils";

export default function ColorCompany({ isSecondary = false }) {
  const {
    profilColors,
    colorCompanies,
    setColorSelectionState,
    setColorCompanies,
    colorSelectionState,
  } = useColorSelectionStore();

  const handleChangeCompany = (value: string) => {
    const company = colorCompanies?.find(
      (company) => company.trdr === Number(value)
    );
    const index = isSecondary ? 1 : 0;
    const newState = [...colorSelectionState];
    newState[index] = {
      ...newState[index],
      selectedColorCompany: company?.trdr || null,
      selectedTrdpgroup: company?.trdpgroup || null,
    };
    console.log("newState", newState);  
    setColorSelectionState(newState);

  };

  const getColorCompanies = useCallback(async () => {
    const data = await fetchColorCompanies(); // get color companies from api
    const colorCompanies = data.map((item: { trdr: number; name: string; trdpgroup: number }) => ({
      trdr: item.trdr,
      name: item.name,
      trdpgroup: item.trdpgroup,
    }));
    setColorCompanies(colorCompanies);
  }, [setColorCompanies]);

  useEffect(() => {
    if (
      profilColors === profilColorsType.COLOR ||
      profilColors === profilColorsType.DUAL_COLOR
    ) {
      getColorCompanies();
    }
  }, [getColorCompanies, profilColors]);

  if (!colorCompanies||colorCompanies.length === 0) return null;

  console.log("colorSelectionState", colorSelectionState);

  return (
    <div className="w-full max-w-[250px] space-y-2">
      <Label htmlFor="color-company-select" className="text-sm font-medium">
        Επιλογή Βαφείου
      </Label>
      <Select
        value={colorSelectionState[isSecondary ? 1 : 0]?.selectedColorCompany?.toString() || ""} 
        onValueChange={handleChangeCompany}
      >
        <SelectTrigger id="color-company-select" className="w-full max-w-sm">
          <SelectValue placeholder="Επιλέξτε βαφείο" />
        </SelectTrigger>
        <SelectContent>
          {colorCompanies?.map((colorCompany: { trdr: number; name: string }) => (
            <SelectItem
              key={colorCompany.trdr}
              value={colorCompany.trdr.toString()}
            >
              {colorCompany.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
