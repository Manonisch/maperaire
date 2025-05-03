import { countedFoodPoint } from "./foodtypes";
import { ChapterQueryResults } from "../types";
import { LocationData } from "../../stores/DataPointsStore";
import { groupParentFoods, foodColorMap } from "./FoodStatics";

export function countFoodInPoint(foodPoints: LocationData[]): countedFoodPoint[] {
  const theRetour: countedFoodPoint[] = [];
  foodPoints.forEach(
    (foodPoint) => {
      const theFoods = new Map<string, number>();
      foodPoint.labels.forEach(food => {
        theFoods.set(food, (theFoods.get(food) ?? 0) + 1)
      })
      theRetour.push({
        countedFood: theFoods,
        coords: [...foodPoint.coords],
        locName: foodPoint.locName,
        type: foodPoint.type
      })
    }
  )
  return theRetour;
}

export function getAllKindsOfFood(foodPoints: ChapterQueryResults[]): string[] {
  const allKindsOfFood = foodPoints.flatMap(foodPoint => {
    const m = foodPoint.matches;
    if (m) {
      return m.flatMap(mm => mm.labels);
    } else {
      return [];
    }
  });
  const uniqueFoods = new Set(allKindsOfFood);
  return Array.from(uniqueFoods).sort();
}

export function getFoodColors(foods: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  foods.forEach((food) => {
    const parent = groupParentFoods[food];
    console.log('what is the parent to this food?', food, 'parent', parent)
    result[food] = foodColorMap[parent];
  });
  return result;
}





