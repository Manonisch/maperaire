import { useCallback } from "react";
import { usePage } from "../../stores/PageStore";

export const MapLink = () => {
  const { gotoPage } = usePage();
  const gotoOtherPage = useCallback(() => gotoPage('map'), [gotoPage]);

  return (
    <button onClick={gotoOtherPage}>
      Map
    </button>
  )
}