import { useCallback } from "react";
import { usePage } from "../stores/PageStore";

export const SourcesLink = () => {
  const { gotoPage } = usePage();
  const gotoOtherPage = useCallback(() => gotoPage('sources'), [gotoPage]);

  return (
    <button className='w-[26px] h-[26px] rounded-[6px] bg-stone-400 text-stone-600 m-[2px] underline' onClick={gotoOtherPage}>
      Sources
    </button>
  )
}