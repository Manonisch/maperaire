import { MouseEvent } from "react";

export const GhostPointButton = ({ handleClick, text }: { handleClick: (e: MouseEvent<HTMLButtonElement>) => void, text: string }) => {
  return (
    <button
      style={{ height: '26px', borderRadius: '6px', backgroundColor: 'oklch(70.9% 0.01 56.259)', color: 'oklch(26.8% 0.007 34.298)', margin: '2px' }}
      onClick={handleClick}>
      {text}
    </button>
  )
}