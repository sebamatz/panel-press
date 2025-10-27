import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";


export default function ColorManufacturer({ isSecondary = false }) {
  const { colorSelectionState, setColorSelectionState } = useColorSelectionStore();
  const handleChangeManifacturer = (value: string) => {
    const newState = [...colorSelectionState];
    newState[isSecondary ? 1 : 0] = { ...newState[isSecondary ? 1 : 0], selectedManifacturer: value, colorData: [] };
    setColorSelectionState(newState);
  };
  const manifacturer = colorSelectionState[isSecondary ? 1 : 0]?.manifacturer;
  return (
    <div className="space-y-2">
    <Label htmlFor="manufacturer-select" className="text-sm font-medium">
      Επιλογή Κατασκευαστή
    </Label>
    <Select value={colorSelectionState[isSecondary ? 1 : 0]?.selectedManifacturer} onValueChange={handleChangeManifacturer}>
      <SelectTrigger id="manufacturer-select" className="">
        <SelectValue placeholder="Επιλέξτε κατασκευαστή" />
      </SelectTrigger>
      <SelectContent>
        {manifacturer.map((manufacturer) => (
          <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
            {manufacturer.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  );
}