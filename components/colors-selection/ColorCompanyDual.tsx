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
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { profilColorsType } from "./OrderOptions";

interface ColorCompanyDualProps {
  isSecondary?: boolean;
}

export default function ColorCompanyDual({ isSecondary = false }: ColorCompanyDualProps) {
  const store = useColorSelectionStore();
  
  // Get the appropriate state based on isSecondary flag
  const profilColors = store.profilColors;
  const colorCompanies = store.colorCompanies;
  const selectedColorCompany = isSecondary ? store.secondarySelectedColorCompany : store.primarySelectedColorCompany;
  
  // Get the appropriate setters
  const setSelectedColorCompany = isSecondary ? store.setSecondarySelectedColorCompany : store.setPrimarySelectedColorCompany;
  const setSelectedTrdpgroup = isSecondary ? store.setSecondarySelectedTrdpgroup : store.setPrimarySelectedTrdpgroup;
  const fetchColorCompanies = store.fetchColorCompanies;

  const handleChangeCompany = (value: string) => {
    const company = colorCompanies?.find(
      (company) => company.trdr === Number(value)
    );
    setSelectedColorCompany(company?.trdr || null);
    setSelectedTrdpgroup(company?.trdpgroup || null);
  };

  useEffect(() => {
    if (
      profilColors === profilColorsType.COLOR ||
      profilColors === profilColorsType.DUAL_COLOR
    ) {
      fetchColorCompanies();
    }
  }, [profilColors, fetchColorCompanies]);

  if (!colorCompanies||colorCompanies.length === 0) return null;

  return (
    <div className="w-full max-w-[250px] space-y-2">
      <Label htmlFor="color-company-select" className="text-sm font-medium">
        Επιλογή Βαφείου {isSecondary ? "(2ο)" : "(1ο)"}
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
