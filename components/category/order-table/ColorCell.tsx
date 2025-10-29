import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";
import { profilColorsType } from "@/components/colors-selection/OrderOptions";

export function useColorCell({ readOnly }: { readOnly: boolean }) {
    const { colorSelectionState,profilColors } = useColorSelectionStore();
    const [color, setColor] = useState("");

   
const getColor = useCallback(() =>  {
    if(colorSelectionState.length == 1){
        return colorSelectionState[0].colorValue;
    }
    if(colorSelectionState.length == 2){
        return `color1: ${colorSelectionState[0]?.colorValue} color2: ${colorSelectionState[1]?.colorValue}`;
    }
    if(colorSelectionState.length == 1 && colorSelectionState[0]?.colorManifacturerValue?.sky){
        return colorSelectionState[0].colorManifacturerValue.sky;
    }
    if(colorSelectionState.length == 2 && colorSelectionState[0]?.colorManifacturerValue?.sky && colorSelectionState[1]?.colorManifacturerValue?.sky){
        return `color1: ${colorSelectionState[0].colorManifacturerValue.sky} color2: ${colorSelectionState[1].colorManifacturerValue.sky}`;
    }
    if(!colorSelectionState[0]?.colorManifacturerValue?.sky&&colorSelectionState.length == 1){
        return colorSelectionState[0].colorValue;
    }
    if(!colorSelectionState[0]?.colorManifacturerValue?.sky&&!colorSelectionState[1]?.colorManifacturerValue?.sky&&colorSelectionState.length == 2){
        return `color1: ${colorSelectionState[0].colorValue} color2: ${colorSelectionState[1].colorValue}`;
    }
    return "";
}, [colorSelectionState, profilColors]);


    useEffect(() => {
        setColor(getColor());
    }, [colorSelectionState]);


 

    return { color };
}

export default function ColorCell({ readOnly }: { readOnly: boolean }) {
    const { color } = useColorCell({ readOnly });
    return <span>{color}</span>;
}