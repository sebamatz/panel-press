"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useColorCompany } from "@/hooks/useColorCompany";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";

export default function ColorCompany({ isSecondary = false, title = "" }) {
  const { colorCompanies, selectedCompanyValue, handleChangeCompany, shouldShow } =
    useColorCompany({ isSecondary });

  const { colorSelectionState } = useColorSelectionStore();

  if (!shouldShow) return null;

  console.log("colorSelectionState", colorSelectionState);

  return (
    <div className="w-full max-w-[250px] space-y-2">
      <Label htmlFor="color-company-select" className="text-sm font-medium">
        {title}
      </Label>
      <Select
        value={selectedCompanyValue}
        onValueChange={handleChangeCompany}
      >
        <SelectTrigger id="color-company-select" className="w-full max-w-sm">
          <SelectValue placeholder="Επιλέξτε βαφείο" />
        </SelectTrigger>
        <SelectContent>
          {colorCompanies?.map((colorCompany) => {
            const company = colorCompany as unknown as { trdr: number; name: string; trdpgroup: number };
            return (
              <SelectItem
                key={company.trdr}
                value={company.trdr.toString()}
              >
                {company.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
