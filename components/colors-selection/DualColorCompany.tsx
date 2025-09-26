"use client";
import { useCallback, useEffect } from "react";
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

interface ColorCompany {
  trdr: number;
  name: string;
  trdpgroup: number;
}

interface DualColorCompanyProps {
  position: 'first' | 'second';
  label: string;
}

export default function DualColorCompany({ position, label }: DualColorCompanyProps) {
  const {
    colorCompanies,
    setColorCompanies,
    dualColorSelections,
    updateDualColorSelection,
  } = useColorSelection();

  const currentSelection = dualColorSelections[position];

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
    updateDualColorSelection(position, 'selectedColorCompany', company?.trdr || null);
    updateDualColorSelection(position, 'selectedTrdpgroup', company?.trdpgroup || null);
  };

  useEffect(() => {
    if (colorCompanies.length === 0) {
      getColorCompanies();
    }
  }, [getColorCompanies, colorCompanies.length]);

  if (!colorCompanies || colorCompanies.length === 0) return null;

  return (
    <div className="w-full max-w-[250px] space-y-2">
      <Label htmlFor={`color-company-select-${position}`} className="text-sm font-medium">
        {label}
      </Label>
      <Select
        value={currentSelection.selectedColorCompany?.toString() || ""}
        onValueChange={handleChangeCompany}
      >
        <SelectTrigger id={`color-company-select-${position}`} className="w-full max-w-sm">
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
