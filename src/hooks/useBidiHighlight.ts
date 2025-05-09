import { useCallback, MouseEvent } from "react";
import { useInterestingLabelStore } from "../stores/InterestingLabelStore";

/** @param dataName the event target for the mouseOver & mouseLeave functions, needs to have a
 `data-$dataName` attribute, which contains the corresponding label
 */
export function useBidiHighlight(dataName: string) {
    const interestingLabel = useInterestingLabelStore(s => s.interestingLabel);
    const setInterestingLabel = useInterestingLabelStore(s => s.setInterestingLabel);
    const bidiHighlightMouseOver = useCallback((ev: MouseEvent<any>) => {
        setInterestingLabel(ev.currentTarget.dataset[dataName] ?? null);
    }, []);
    const bidiHighlightMouseLeave = useCallback((ev: MouseEvent<any>) => {
    if (interestingLabel == ev.currentTarget.dataset[dataName]) {
        setInterestingLabel(null);
    }
    }, [interestingLabel]);
    return {
        bidiHighlightMouseOver,
        bidiHighlightMouseLeave,
        interestingLabel,
    };
}