import { useCallback, ChangeEvent, memo, useState } from "react";
import { useFoodMapStore } from "../../stores/FoodMapStore";
import { ItemGroup } from "./foodtypes";
import { foodGroups, prepTypes } from "./FoodStatics";

function prepareFoodItemGroups(): ItemGroup[] {
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
  return (
    <>
      <h3 style={{ position: "absolute" }}>Dragon Cuisine</h3>

      <Legend />

    </>
  );
};

const Counter = memo(() => {
  const selected = useFoodMapStore((s) => s.selectedFoodOptions);
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
  const [usePrepFilter, setUsePrepFilter] = useState(false);
  const setPrepFilter = useFoodMapStore(s => s.setPrepFilter)

  return (
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
        width: usePrepFilter ? "240px" : "160px",
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
        <button onClick={() => {
          setPrepFilter(!usePrepFilter);
          setUsePrepFilter(s => !s)
        }}> {usePrepFilter ? '<<' : '>>'} </button>
      </div>
      <div style={{
        display: "flex", flexDirection: "row", columnGap: '4px', overflowY: "scroll",
        height: "calc(100% - 30px)",
      }}>
        <Foods />
        {usePrepFilter && <Preparations />}
      </div>
    </div>
  )
})

const Foods = memo(() => {
  const legendItems = prepareFoodItemGroups();
  const changeSelectedOption = useFoodMapStore((s) => s.changeSelectedFoodOption);
  const selectedOptions = useFoodMapStore(s => s.selectedFoodOptions)
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    changeSelectedOption(ev.target.id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        rowGap: "8px",
        flexDirection: "column"
      }}
    >
      {legendItems.map((item) => {
        return (
          <div style={{ listStyleType: "none" }} key={item.groupName + "1"}>
            <input
              type="checkbox"
              onChange={handleChange}
              id={item.groupName}
              checked={selectedOptions.includes(item.groupName)}
            />
            <label htmlFor={item.groupName}>{item.groupName ?? ""}</label>
          </div>
        );
      })}
    </div>
  )
})

const Preparations = memo(() => {

  const legendItems = prepTypes;
  const changeSelectedOption = useFoodMapStore((s) => s.changeSelectedPrepOption);
  const selectedOptions = useFoodMapStore(s => s.selectedPrepOptions)
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    changeSelectedOption(ev.target.id);
  }, []);

  return (<div
    style={{
      display: "flex",
      rowGap: "8px",
      flexDirection: "column",
      width: '100%'
    }}
  >
    {legendItems.map((item) => {
      return (
        <div style={{ listStyleType: "none" }} key={item + "1"}>
          <input
            type="checkbox"
            onChange={handleChange}
            id={item}
            checked={selectedOptions.includes(item)}
          />
          <label htmlFor={item}>{item ?? ""}</label>
        </div>
      );
    })}
  </div>)
});