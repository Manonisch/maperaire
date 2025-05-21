import { useCallback, ChangeEvent, memo } from "react";
import { useDragonMapStore } from "../../stores/DragonMapStore";
import { DragonColors } from "./DragonStatics";

const DragonList = ["Perscitia", "Lily", "Maximus", "Arkady", "Iskierka", "Churki"];

export const DragonOverlay = () => {
  return (
    <>
      <h3 style={{ position: "absolute" }}>Dragons Map</h3>
      <VerticalDragons />
    </>
  );
};

const VerticalDragons = memo(() => {
  const selectedOptions = useDragonMapStore(
    (s) => s.selectedDragonOptions
  );
  const changeSelectedOption = useDragonMapStore(
    (s) => s.changeSelectedDragonOption
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
        position: 'relative',
        flexWrap: 'wrap',
        maxWidth: '300px',
        rowGap: '24px'
      }}
    >
      {DragonList.map((item) => {
        const color = DragonColors[item];

        return (
          <div key={item + 'slector'}>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "8px",
                alignItems: "center",
                height: "fit-content",
                textDecoration: 'underline',
                textDecorationColor: color,
                textDecorationThickness: '3px',
              }}
            >
              <input
                style={{ display: "none" }}
                type="checkbox"
                onChange={handleChange}
                id={item}
                checked={selectedOptions.includes(item) || selectedOptions.length === 0}
                className="DragonCheckbox"
              />
              <div
                className={`CharacterPortrait ${item}_portrait`}
                style={{
                  width: "120px",
                  height: "120px",
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
