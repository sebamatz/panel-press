import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { profilColorsType } from "./ProfileColorOptions";
import { useColorOptions } from "@/hooks/useColorOptions";

export default function ColorOptions({ isDisabled }: { isDisabled: boolean }) {
  const { profilColors, handleProfilColors } = useColorOptions();


  return <div className="space-y-4">
  <Label className="text-base font-medium">Επιλογή χρώματος</Label>
  <RadioGroup
    value={profilColors}
    onValueChange={handleProfilColors}
    className="flex flex-row space-x-6"
  >
    {/* <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value={profilColorsType.BLANK} 
        id="blank" 
        disabled={isDisabled}
      />
      <Label htmlFor="blank" className="text-sm font-normal">
        Άβαφο
      </Label>
    </div> */}
    <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value={profilColorsType.WHITE.colorType.toString()} 
        id="white" 
        disabled={isDisabled}
      />
      <Label htmlFor="white" className="text-sm font-normal">
        Λευκό
      </Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value={profilColorsType.COLOR.colorType.toString()} 
        id="color" 
        disabled={isDisabled}
      />
      <Label htmlFor="color" className="text-sm font-normal">
        Χρώμα
      </Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem 
        value={profilColorsType.DUAL_COLOR.colorType.toString()} 
        id="color" 
        disabled={isDisabled}
      />
      <Label htmlFor="color" className="text-sm font-normal">
        Δυχρωμία
      </Label>
    </div>
  </RadioGroup>
</div>
}