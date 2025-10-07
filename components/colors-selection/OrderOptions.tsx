import React, { useState } from "react";
import ColorSelections from "./ColorSelections";
import ColorCompany from "./ColorCompany";
import ColorSelectionsDual from "./ColorSelectionsDual";
import ColorCompanyDual from "./ColorCompanyDual";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
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
    primarySelectedTrdpgroup, 
    setProfilColors,
    setPrimarySelectedTrdpgroup 
  } = useColorSelectionStore();
 
  const [colorValue, setColorValue] = useState<string>("");

  const handleProfilColors = (value: string) => {
    setPrimarySelectedTrdpgroup(null);
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
    <div className="w-full space-y-6 ">
      <ColorOptions />
      {profilColors === profilColorsType.DUAL_COLOR && (
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-between items-baseline gap-4">
            <ColorCompanyDual isSecondary={false} />
          </div>
          <div className="flex w-full items-baseline gap-4">
            <ColorSelectionsDual isSecondary={false} />
          </div>
          <div className="flex w-full justify-between items-baseline gap-4">
            <ColorCompanyDual isSecondary={true} />
          </div>
          <div className="flex w-full items-baseline gap-4"> 
            <ColorSelectionsDual isSecondary={true} />
          </div>
        </div>
      )}

      {profilColors === profilColorsType.COLOR && (
        <div className="space-y-4 flex items-baseline gap-4">
          <div className="flex items-baseline gap-4">
            <ColorCompany />
          </div>
          <div className="flex items-baseline gap-4">
            {primarySelectedTrdpgroup === 1 ? (
              <ColorSelections />
            ) : (
              primarySelectedTrdpgroup && (
                <ColorCodeInput />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const OrderOptions = ({ isDisabled }: Props) => {
  return <OrderOptionsContent isDisabled={isDisabled} />;
};

export default OrderOptions;
