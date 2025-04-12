import { useCallback } from "react";
import { usePage } from "../stores/PageStore";

export const MapLink = () => {
  const { gotoPage } = usePage();
  const gotoOtherPage = useCallback(() => gotoPage('map'), [gotoPage]);

  return (
    <button className='w-[26px] h-[26px] rounded-[6px] bg-stone-400 text-stone-600 m-[2px] underline' onClick={gotoOtherPage}>
      Map
    </button>
  )
}