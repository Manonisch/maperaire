import { useCallback } from "react";
import { usePage } from "../../stores/PageStore";

export const SourcesLink = () => {
  const { gotoPage } = usePage();
  const gotoOtherPage = useCallback(() => gotoPage('sources'), [gotoPage]);

  return (
    <button style={{ height: '26px', border: 'unset', borderRadius: '6px', color: 'oklch(26.8% 0.007 34.298)', margin: '2px' }} onClick={gotoOtherPage}>
      Sources
    </button>
  )
}