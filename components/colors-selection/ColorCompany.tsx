"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getItems } from "@/api/fetch";
import { useColorSelection } from "./ColorSelectionContext";
import { profilColorsType } from "./OrderOptions";

interface ColorCompany {
  trdr: number;
  name: string;
  trdpgroup: number;
}

export default function ColorCompany() {
  const {
    profilColors,
    setSelectedTrdpgroup,
    colorCompanies,
    setColorCompanies,
    setSelectedColorCompany,
    selectedColorCompany,
  } = useColorSelection();

  const getColorCompanies = useCallback(async () => {
    const data60 = await getItems({ BOption: 60, Company: 10 });
    setColorCompanies(
      data60.map((item: { trdr: number; name: string; trdpgroup: number }) => ({
        trdr: item.trdr,
        name: item.name,
        trdpgroup: item.trdpgroup,
      }))
    );
  }, [setColorCompanies]);

  const handleChangeCompany = (value: string) => {
    const company = colorCompanies?.find(
      (company: ColorCompany) => company.trdr === Number(value)
    );
    setSelectedColorCompany(company?.trdr || null);
    setSelectedTrdpgroup(company?.trdpgroup || null);
  };

  useEffect(() => {
    if (
      profilColors === profilColorsType.COLOR ||
      profilColors === profilColorsType.DUAL_COLOR
    ) {
      getColorCompanies();
    }
  }, [profilColors]);

  if (!colorCompanies||colorCompanies.length === 0) return null;

  return (
    <div className="w-full max-w-[250px] space-y-2">
      <Label htmlFor="color-company-select" className="text-sm font-medium">
        Επιλογή Βαφείου
      </Label>
      <Select
        value={selectedColorCompany?.toString() || ""}
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
