import { memo, useState, useCallback, ChangeEvent } from "react";
import { useQuery, queryRefs, Querys } from "../stores/QueryStore";
import { GhostPointButton } from "./GhostPointButton";
import { SourcesLink } from "./links/SourcesLink";

export const TopBar = memo(({ handleGhostLines }: { handleGhostLines: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [ghostyLines, setGhostyLines] = useState(false)
  const chooseQuery = useQuery(s => s.chooseQuery)

  const queryArray = Object.entries(queryRefs);

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    chooseQuery(event.target.value as Querys);
  }, [])

  return <div style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center' }}> 
  <SourcesLink />
    <select onChange={handleChange} style={{ height: '26px', borderRadius: '6px', border: 'unset', color: 'oklch(26.8% 0.007 34.298)', margin: '2px' }}
    >{queryArray.map(entry => {
      return (<option key={'option' + entry[0]} value={entry[0]}>{entry[0]}</option>)
    })}
    </select>
    <GhostPointButton handleClick={() => {
      setGhostyLines(s => !s)
      handleGhostLines(s => !s)
    }} ghostyLines={ghostyLines} />
    <span style={{ fontSize: '14px', color: '#555', paddingInlineStart: '10px' }}>   <span style={{ fontWeight: 'bold' }}>Move the Globe</span> by dragging with the mouse, zoom via scroll wheel. Hover on points to <span style={{ fontWeight: 'bold' }}>see more information</span>. To <span style={{ fontWeight: 'bold' }}>Filter</span> drag and move the handles on the bottom axis.</span>
  </div>
})