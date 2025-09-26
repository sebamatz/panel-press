import React, { useState } from "react";
import ColorSelections from "./ColorSelections";
import ColorCompany from "./ColorCompany";
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
  const { profilColors, setProfilColors } = useColorSelection();
 
  const [colorValue, setColorValue] = useState<string>("");
  const [selectedTrdpgroup, setSelectedTrdpgroup] = useState<number | null>(null);

  const handleProfilColors = (value: string) => {
    setSelectedTrdpgroup(null);
    setColorValue("");
    setProfilColors(value);
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
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-between items-baseline gap-4">
          <ColorCompany />
          <ColorSelections />
        </div>
        <div className="flex w-full items-baseline gap-4"> 
          <ColorCompany />
          <ColorSelections />
        </div>
        </div>
      )}

      {profilColors === profilColorsType.COLOR && (
        <div className="flex items-baseline gap-4">
          <ColorCompany />
          <ColorSelections />
        </div>
      )}
      
      {profilColors === profilColorsType.COLOR && (
        <div className="space-y-4">
          {selectedTrdpgroup === 1 ? (
            <ColorSelections />
          ) : (
            selectedTrdpgroup && (
              <ColorCodeInput />
            )
          )}
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
