import { useState } from "react";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface DependOndimesionSelectProps {
    onSelectionChange: (selected: string[]) => void;
    options: any[];
    selectedValues: any;
    field: string;
}

export default function DependOndimesionSelect({ onSelectionChange, options, selectedValues, field }: DependOndimesionSelectProps) {

    console.log(selectedValues, "selectedValues");

    const [optionList, setOptionList] = useState<any[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>("");

    const handleSelectionChange = (value: string) => {
        setSelectedValue(value);
        const selectedOption = optionList.find((option: any) => option.id === value);
        onSelectionChange(selectedOption);
    }

   


    const handleSetOptionList = () => {
        if (!selectedValues?.dimension) {
            return [];
        }
        const optionList = options.find((option: any) => option.UTBL03.toString() === selectedValues.dimension.toString());
        setOptionList(optionList?.[field]);
    }
    useEffect(() => {
        handleSetOptionList();
    }, [selectedValues]);

    useEffect(() => {
        if(field==='lamarina' && selectedValues?.lamarina ){
            setSelectedValue(selectedValues?.lamarina.id);
        }else if(field==='gemisi' && selectedValues?.gemisi){
            setSelectedValue(selectedValues?.gemisi?.id);
        }
    }, [selectedValues, field]);
 
    return (selectedValues?.dimension ?
        <Select onValueChange={(value) => handleSelectionChange(value)} value={selectedValue}>
            <SelectTrigger>
                <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
                { optionList && optionList.map((option: any, index: number) => (
                    <SelectItem key={index} value={option.id}>
                        {option.name}
                    </SelectItem>
                ))
            }   
        </SelectContent>
    </Select>
    : null
    );
}