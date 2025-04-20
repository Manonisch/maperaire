import { memo, useState, useCallback, ChangeEvent } from "react";
import { useQuery, queryRefs, Querys } from "../stores/QueryStore";
import { GhostPointButton } from "./GhostPointButton";
import { SourcesLink } from "./SourcesLink";

export const TopBar = memo(({ handleGhostLines }: { handleGhostLines: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [ghostyLines, setGhostyLines] = useState(false)
  const chooseQuery = useQuery(s => s.chooseQuery)

  const queryArray = Object.entries(queryRefs);

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    chooseQuery(event.target.value as Querys);
  }, [])

  return <div className="w-full h-[40px] flex" style={{ width: '100%', height: '40px', display: 'flex' }}> <SourcesLink />
    <select onChange={handleChange} style={{ height: '26px', borderRadius: '6px', backgroundColor: 'oklch(70.9% 0.01 56.259)', color: 'oklch(26.8% 0.007 34.298)', margin: '2px' }}
    >{queryArray.map(entry => {
      return (<option key={'option' + entry[0]} value={entry[0]}>{entry[0]}</option>)
    })}
    </select>
    <GhostPointButton handleClick={() => {
      setGhostyLines(s => !s)
      handleGhostLines(s => !s)
    }} text={ghostyLines ? 'Hide GhostLines' : 'Show GhostLines'} />
    <span style={{ fontSize: '14px', color: '#555', textAlign: 'center', paddingInlineStart: '10px' }}>   <span style={{ fontWeight: 'bold' }}>Move the Globe</span> by dragging with the mouse, zoom via scroll wheel. Hover on points to <span style={{ fontWeight: 'bold' }}>see more information</span>. To <span style={{ fontWeight: 'bold' }}>Filter</span> drag and move the handles on the bottom axis.</span>
  </div>
})