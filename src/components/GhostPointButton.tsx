import { MouseEvent } from "react";

export const GhostPointButton = ({ handleClick, ghostyLines }: { handleClick: (e: MouseEvent<HTMLButtonElement>) => void, ghostyLines: boolean }) => {
  return (
    <button
      style={{ height: '26px', borderRadius: '6px', border: 'unset', backgroundColor: ghostyLines ? 'oklch(86.9 % 0.005 56.366)' : 'oklch(92.3% 0.003 48.717)', color: 'oklch(26.8% 0.007 34.298)', margin: '2px' }}
      onClick={handleClick}>
      {ghostyLines ? 'Hide GhostLines' : 'Show GhostLines'}
    </button>
  )
}