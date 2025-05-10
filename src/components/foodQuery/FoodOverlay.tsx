import { useCallback, ChangeEvent, memo, useState } from "react";
import { useFoodMapStore } from "../../stores/FoodMapStore";
import { ItemGroup } from "./foodtypes";
import { useBidiHighlight } from "../../hooks/useBidiHighlight";
import { foodColorMap, foodGroups, foodIconMap, groupParentFoods, groupParentIconFoods, prepColors } from "./FoodStatics";

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
        backgroundColor: "rgba(232, 223, 210, 0.8)",
        height: "78vh",
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

  const selectedOptions = useFoodMapStore(s => s.selectedFoodOptions)
  const changeSelectedOption = useFoodMapStore((s) => s.changeSelectedFoodOption);
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
      {legendItems.map((item) => {

        const parent = groupParentFoods[item.groupName];
        const color = parent in foodColorMap ? foodColorMap[parent] : 'rgba(150, 150, 150, 0.5)'

        const parentIcon = groupParentIconFoods[item.groupName];
        const FoodIcon = foodIconMap[parentIcon];

        return (
          <div
            style={{
              listStyleType: "none",
              fontWeight: interestingLabel == item.groupName ? 'bold' : undefined,
            }}
            key={item.groupName + "1"}
            data-groupname={item.groupName}
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
              {FoodIcon &&
                <FoodIcon
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
              id={item.groupName}
              checked={selectedOptions.includes(item.groupName)}
            />
            <label htmlFor={item.groupName}>{item.groupName ?? ""}</label>
          </div>
        );
      })}
    </div>
  )
});

const Preparations = memo(() => {

  const legendItems = Object.entries(prepColors);
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
          {/* <span style={{
            width: '15px',
            height: '15px',
            borderRadius: '100%',
            backgroundColor: item[1],
            display: 'inline-block'
          }} /> */}
          <input
            type="checkbox"
            onChange={handleChange}
            id={item[0]}
            checked={selectedOptions.includes(item[0])}
          />
          <label htmlFor={item[0]}>{item[0] ?? ""}</label>
        </div>
      );
    })}
  </div>)
});