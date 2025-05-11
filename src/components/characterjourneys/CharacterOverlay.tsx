import { useCallback, ChangeEvent, memo } from "react";
import { useBidiHighlight } from "../../hooks/useBidiHighlight";
import { useCharacterMapStore } from "../../stores/CharacterMapStore";
import { CharacterColors, CharacterIconMap } from "./CharacterStatics";

const CharacterList = [
  "Jane",
  "Tharkay",
  "Granby",
  "Riley"
]

export const CharacterOverlay = () => {
  return (
    <>
      <h3 style={{ position: "absolute" }}>Side Characters Map</h3>
      <Legend />
    </>
  );
};

const Counter = memo(() => {
  const selected = useCharacterMapStore((s) => s.selectedCharacterOptions);
  return (
    <span
      style={{
        borderRadius: "10px",
        padding: "2px",
        backgroundColor: "olivedrab",
        color: "antiquewhite",
        width: "24px",
        display: "inline-block",
        textAlign: "center",
        verticalAlign: 'bottom'
      }}
    >
      {selected?.length ?? 0}
    </span>
  );
});

const Legend = memo(() => {

  return (
    <div
      id="Legend"
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        overflow: "hidden",
        padding: "16px",
        backgroundColor: "rgba(232, 223, 210, 0.8)",
        height: "78vh",
        width: "160px",
      }}
    >
      <div
        style={{
          padding: "6px",
          borderBottom: "1px solid grey",
          marginBottom: "2px",
        }}
      >
        Characters <Counter />
      </div>
      <div style={{
        display: "flex", flexDirection: "row", columnGap: '4px', overflowY: "scroll",
        height: "calc(100% - 30px)",
      }}>
        <Characters />
      </div>
    </div>
  )
})

const Characters = memo(() => {

  const selectedOptions = useCharacterMapStore(s => s.selectedCharacterOptions)
  const changeSelectedOption = useCharacterMapStore((s) => s.changeSelectedCharacterOption);
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    changeSelectedOption(ev.target.id);
  }, []);

  const { interestingLabel, bidiHighlightMouseOver, bidiHighlightMouseLeave } = useBidiHighlight('groupname');

  return (
    <div
      style={{
        display: "flex",
        rowGap: "8px",
        flexDirection: "column"
      }}
    >
      {CharacterList.map((item) => {

        const color = CharacterColors[item];
        const CharacterIcon = CharacterIconMap[item];

        return (
          <div
            style={{
              listStyleType: "none",
              fontWeight: interestingLabel == item ? 'bold' : undefined,
            }}
            key={item + "1"}
            data-groupname={item}
            onMouseOver={bidiHighlightMouseOver}
            onMouseLeave={bidiHighlightMouseLeave}
          >
            <span style={{
              width: '15px',
              height: '15px',
              borderRadius: '100%',
              // backgroundColor: color,
              opacity: '0.5',
              display: 'inline-block'
            }} >
              {CharacterIcon &&
                <CharacterIcon
                  width="20px"
                  height="20px"
                  fill={color}
                  stroke="#222"
                  style={{ strokeWidth: '2%' }}
                />}
            </span>
            <input
              type="checkbox"
              onChange={handleChange}
              id={item}
              checked={selectedOptions.includes(item)}
            />
            <label htmlFor={item}>{item}</label>
          </div>
        );
      })}
    </div>
  )
});
