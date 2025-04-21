import { useCallback, ChangeEvent, memo } from "react";
import { useFoodMapStore } from "../../stores/FoodMapStore";
import { foodGroups, ItemGroup } from "./foodtypes";

function prepareItemGroups(): ItemGroup[] {
  const itemGroup: ItemGroup[] = [];
  Array.from(foodGroups.entries()).forEach((item) => {
    itemGroup.push({
      groupName: item[0],
      elements: item[1],
    });
  });
  return itemGroup;
}

export const FoodOverlay = () => {
  const legendItems = prepareItemGroups();
  const changeSelectedOption = useFoodMapStore((s) => s.changeSelectedOption);
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    changeSelectedOption(ev.target.id);
  }, []);

  return (
    <>
      <h3 style={{ position: "absolute" }}>Dragon Cuisine</h3>
      <div
        id="Legend"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          overflow: "hidden",
          padding: "16px",
          backgroundColor: "#e8dfd2",
          height: "50vh",
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
          Food types <Counter />
        </div>
        <div
          style={{
            display: "flex",
            rowGap: "8px",
            flexDirection: "column",
            overflowY: "scroll",
            height: "calc(100% - 30px)",
          }}
        >
          {legendItems.map((item) => {
            return (
              <div style={{ listStyleType: "none" }} key={item.groupName + "1"}>
                <input
                  type="checkbox"
                  onChange={handleChange}
                  id={item.groupName}
                />
                <label htmlFor={item.groupName}>{item.groupName ?? ""}</label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const Counter = memo(() => {
  const selected = useFoodMapStore((s) => s.selectedOptions);

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
