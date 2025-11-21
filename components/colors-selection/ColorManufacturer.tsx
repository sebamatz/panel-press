import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useColorManufacturer } from "@/hooks/useColorManufacturer";

export default function ColorManufacturer({ isSecondary = false }) {
  const {
    manifacturer,
    selectedManifacturer,
    handleChangeManifacturer,
  } = useColorManufacturer({ isSecondary });

  return (
    <div className="space-y-2">
      <Label htmlFor="manufacturer-select" className="text-sm font-medium">
        Επιλογή Κατασκευαστή
      </Label>
      <Select value={selectedManifacturer} onValueChange={handleChangeManifacturer}>
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