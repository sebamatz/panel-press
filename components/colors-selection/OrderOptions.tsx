import React, { useState } from "react";
import ColorSelections from "./ColorSelections";
import ColorCompany from "./ColorCompany";
import DualColorSelection from "./DualColorSelection";
import DualColorCompany from "./DualColorCompany";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ColorSelectionProvider, useColorSelection } from "./ColorSelectionContext";
import ColorCodeInput from "./ColorCodeInput";

// Constants
export const profilColorsType = {
  BLANK: "blank",
  WHITE: "white", 
  COLOR: "color",
  DUAL_COLOR: "dual_color"
};

type Props = {
  isDisabled: boolean;
};

const OrderOptionsContent = ({ isDisabled }: Props) => {
  const { 
    profilColors, 
    setProfilColors, 
    setDualColorSelections,
    setColorType,
    setSelectedManifacturer,
    setColorData,
    setColorManifacturerValue,
    setColorValue,
    setSelectedColorCompany,
    selectedTrdpgroup,
    setSelectedTrdpgroup
  } = useColorSelection();

  const handleProfilColors = (value: string) => {
    // Reset all state when switching order options
    setSelectedTrdpgroup(null);
    setColorValue("");
    setProfilColors(value);
    
    // Reset dual color selections
    setDualColorSelections({
      first: {
        selectedColorCompany: null,
        selectedTrdpgroup: null,
        colorType: "",
        selectedManifacturer: "",
        colorValue: "",
        colorData: [],
        colorManifacturerValue: "",
      },
      second: {
        selectedColorCompany: null,
        selectedTrdpgroup: null,
        colorType: "",
        selectedManifacturer: "",
        colorValue: "",
        colorData: [],
        colorManifacturerValue: "",
      },
    });
    
    // Reset single color state
    setColorType("");
    setSelectedManifacturer("");
    setColorData([]);
    setColorManifacturerValue("");
    setSelectedColorCompany(null);
  };
  
  const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    const c = (event.target as HTMLInputElement).value;
    setColorValue(c);
  };

const ColorOptions = () => <div className="space-y-4">
  <Label className="text-base font-medium">Επιλογή χρώματος</Label>
  <RadioGroup
    value={profilColors}
    onValueChange={handleProfilColors}
    className="flex flex-row space-x-6"
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value={profilColorsType.BLANK} 
        id="blank" 
        disabled={isDisabled}
      />
      <Label htmlFor="blank" className="text-sm font-normal">
        Άβαφο
      </Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value={profilColorsType.WHITE} 
        id="white" 
        disabled={isDisabled}
      />
      <Label htmlFor="white" className="text-sm font-normal">
        Λευκό
      </Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value={profilColorsType.COLOR} 
        id="color" 
        disabled={isDisabled}
      />
      <Label htmlFor="color" className="text-sm font-normal">
        Χρώμα
      </Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value={profilColorsType.DUAL_COLOR} 
        id="color" 
        disabled={isDisabled}
      />
      <Label htmlFor="color" className="text-sm font-normal">
        Δυχρωμία
      </Label>
    </div>
  </RadioGroup>
</div>

  return (
    <div className="w-full space-y-6">
      <ColorOptions />
      {profilColors === profilColorsType.DUAL_COLOR && (
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Πρώτο Χρώμα</Label>
            <div className="flex w-full items-baseline gap-4">
              <DualColorCompany position="first" label="Επιλογή Βαφείου" />
              <DualColorSelection position="first" label="Τύπος Χρώματος" />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="text-base font-medium">Δεύτερο Χρώμα</Label>
            <div className="flex w-full items-baseline gap-4">
              <DualColorCompany position="second" label="Επιλογή Βαφείου" />
              <DualColorSelection position="second" label="Τύπος Χρώματος" />
            </div>
          </div>
        </div>
      )}

      {profilColors === profilColorsType.COLOR && (
        <div className="flex items-baseline gap-4">
          <ColorCompany />
          <ColorSelections />
        </div>
      )}
      

    </div>
  );
};

const OrderOptions = ({ isDisabled }: Props) => {
  return (
    <ColorSelectionProvider>
      <OrderOptionsContent isDisabled={isDisabled} />
    </ColorSelectionProvider>
  );
};

export default OrderOptions;
