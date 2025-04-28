import { foodGroups } from "./foodtypes";
import { ChapterQueryResults } from "../types";

export function prepareFood(usedFilterData: ChapterQueryResults[], selectedFoodOptions: string[]) {
  let allFoodItems: string[] = [];
  selectedFoodOptions.forEach((option) => {
    allFoodItems = allFoodItems.concat(foodGroups.get(option) ?? []);
  });
  const resultData = usedFilterData?.filter(filterItem => {
    if (filterItem.matches) {
      const localMatches = filterItem.matches as string[][]

      const reducedMatches: string[] = localMatches.reduce(
        (accumulator, currentValue) => accumulator.concat(currentValue),
        [],
      );
      return reducedMatches.some(r => allFoodItems.includes(r))
    }
    return false;
  })
  return resultData;
}