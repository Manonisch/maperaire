import { useCallback, ChangeEvent } from "react";
import { useFoodMapStore } from "../../stores/FoodMapStore";
import { foodGroups, ItemGroup } from "./foodtypes";

function prepareItemGroups(): ItemGroup[] {
  const itemGroup: ItemGroup[] = [];
  Array.from(foodGroups.entries()).forEach(item => {
    itemGroup.push({
      groupName: item[0],
      elements: item[1]
    });
  })
  return itemGroup;
}

export const FoodOverlay = () => {
  const legendItems = prepareItemGroups()
  const changeSelectedOption = useFoodMapStore(s => s.changeSelectedOption)
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    changeSelectedOption(ev.target.id)
  }, [])

  return (
    <>
      <h3 style={{ position: 'absolute' }}>Dragon Cuisine</h3>
      <div id='Legend' style={{ position: 'absolute', top: '20px', right: '20px', overflowY: 'scroll', padding: '16px', backgroundColor: '#e8dfd2', height: '50vh', width: '160px' }}>
        <div style={{ display: 'flex', rowGap: '8px', flexDirection: 'column' }}>
          <span>Food types</span>
          {legendItems.map((item) => {
            return (<div style={{ listStyleType: 'none' }} key={item.groupName + '1'}>
              <input type='checkbox' onChange={handleChange} id={item.groupName} />
              <label htmlFor={item.groupName}>{item.groupName ?? ''}</label>
            </div>)
          })}

        </div>
      </div>
    </>
  )
}