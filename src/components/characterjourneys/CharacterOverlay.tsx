import { useCallback, ChangeEvent, memo } from "react";
import { useCharacterMapStore } from "../../stores/CharacterMapStore";
import { CharacterColors } from "./CharacterStatics";

const CharacterList = ["Jane", "Tharkay", "Granby", "Riley"];

export const CharacterOverlay = () => {
  return (
    <>
      <h3 style={{ position: "absolute" }}>Side Characters Map</h3>
      <VerticalCharacters />
    </>
  );
};

const VerticalCharacters = memo(() => {
  const selectedOptions = useCharacterMapStore(
    (s) => s.selectedCharacterOptions
  );
  const changeSelectedOption = useCharacterMapStore(
    (s) => s.changeSelectedCharacterOption
  );
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    changeSelectedOption(ev.target.id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        columnGap: "24px",
        marginInlineEnd: "10px",
        float: "inline-end",
        height: 0,
      }}
    >
      {CharacterList.map((item) => {
        const color = CharacterColors[item];

        return (
          <div>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "8px",
                alignItems: "center",
                height: "fit-content",
              }}
            >
              <input
                style={{ display: "none" }}
                type="checkbox"
                onChange={handleChange}
                id={item}
                checked={selectedOptions.includes(item)}
                className="characterCheckbox"
              />
              <div
                className="CharacterPortrait"
                style={{
                  width: "60px",
                  height: "80px",
                  backgroundColor: color,
                }}
              ></div>
              {item}
            </label>
          </div>
        );
      })}
    </div>
  );
});
