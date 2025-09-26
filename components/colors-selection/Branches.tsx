import React, { ReactElement, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface IBranch {
  branchcode: string;
  address: string;
}

interface Props {}

export default function Branches({}: Props): ReactElement {
  const [branches, setBranches] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
  
  // Mock customer data
  const customer = {
    branches: [
      { branchcode: "001", address: "Κεντρικό Κατάστημα" },
      { branchcode: "002", address: "Υποκατάστημα Αθήνας" },
      { branchcode: "003", address: "Υποκατάστημα Θεσσαλονίκης" },
    ]
  };

  const handleSelectBranch = (value: string) => {
    const selected = customer.branches.find((data: IBranch) => data.branchcode === value);
    setSelectedBranch(selected || null);
  };
  
  useEffect(() => {
    if(customer?.branches.length > 0){
      setBranches(selectedBranch?.branchcode || "");
    }
  }, [selectedBranch, customer?.branches.length]);

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="branch-select" className="text-sm font-medium">
        ΚΑΤΑΣΤΗΜΑ
      </Label>
      {customer?.branches.length > 0 && (
        <Select value={branches} onValueChange={handleSelectBranch}>
          <SelectTrigger id="branch-select" className="w-full">
            <SelectValue placeholder="Επιλέξτε κατάστημα" />
          </SelectTrigger>
          <SelectContent>
            {customer?.branches.map((v: IBranch, i) => ( 
              <SelectItem key={i} value={v.branchcode}>{v.address}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
