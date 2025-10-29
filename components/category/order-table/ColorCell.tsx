import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";

export default function ColorCell({ readOnly }: { readOnly: boolean }) {
    const { colorSelectionState } = useColorSelectionStore();
    const [color, setColor] = useState("");
    const currentColor = colorSelectionState.length == 1 ? colorSelectionState[0].colorValue : `color1: ${colorSelectionState[0]?.colorValue} color2: ${colorSelectionState[1]?.colorValue}`;
    useEffect(() => {
        setColor(currentColor);
    }, [colorSelectionState]);

    return readOnly ? <span>{color}</span> : (
            <span>{color}</span>
        
    );
}