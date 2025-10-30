import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";
import { profilColorsType } from "@/components/colors-selection/OrderOptions";

export function useColorCell() {
    const { colorSelectionState,profilColors } = useColorSelectionStore();
    const [color, setColor] = useState("");

    const getColor = useCallback(() => {
        if(profilColors === profilColorsType.WHITE){
            return "Λευκό";
        }
        if (!colorSelectionState || colorSelectionState.length === 0) return "";
        // Map colorSelectionState to extract preferred color string per selection
        const colors = colorSelectionState.map(sel => {
            // Prefer colorValue, fallback to colorManifacturerValue.sky
            if (sel?.colorValue) return sel.colorValue;
            if (sel?.colorManifacturerValue?.sky) return sel.colorManifacturerValue.sky;
            return "";
        }).filter(Boolean);
        return colors.join(" / ");
    }, [colorSelectionState]);

    useEffect(() => {
        setColor(getColor());
    }, [colorSelectionState, getColor]);

    return { color };
}

export default function ColorCell({ readOnly }: { readOnly: boolean }) {
    const { color } = useColorCell();
    return <span>{color}</span>;
}