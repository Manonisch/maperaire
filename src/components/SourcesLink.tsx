import { useCallback } from "react";
import { usePage } from "../stores/PageStore";

export const SourcesLink = () => {
  const { gotoPage } = usePage();
  const gotoOtherPage = useCallback(() => gotoPage('sources'), [gotoPage]);

  return (
    <button style={{ height: '26px', borderRadius: '6px', backgroundColor: 'oklch(70.9% 0.01 56.259)', color: 'oklch(26.8% 0.007 34.298)', margin: '2px' }} onClick={gotoOtherPage}>
      Sources
    </button>
  )
}