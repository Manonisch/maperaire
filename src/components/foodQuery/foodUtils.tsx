import { countedFoodPoint, foodGroups, FoodPoint, groupFoods } from "./foodtypes";
import { ChapterQueryResults, FunnyEntry } from "../types";

export function prepareFood(usedFilterData: ChapterQueryResults[], selectedFoodOptions: string[]) {
  let allFoodItems: string[] = [];
  selectedFoodOptions.forEach((option) => {
    allFoodItems = allFoodItems.concat(foodGroups.get(option) ?? []);
  });
  const resultData = usedFilterData?.filter(filterItem => {
    if (filterItem.matches) {
      const localMatches = filterItem.matches.map(m => m.labels);

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


/**
  * Returns results as lists per map point/path
  * @param loclabel 
  * @param results 
  * @returns list of lists of matches for this point only
  */
function findMatchesInSamePoint(loclabel: FunnyEntry, results: ChapterQueryResults[]): string[][] | undefined {
  const chapter = results.find((chapter) => chapter.bookIndex == loclabel.bookIndex && chapter.chapterIndex == loclabel.chapterIndex);
  const actual = chapter?.matches?.filter(match => match.paragraphIndex >= loclabel.startParagraph! && match.paragraphIndex <= loclabel.endParagraph!)

  const matches = actual?.map(act => { return act.labels })

  if (!isStringArrayArray(matches)) {
    return;
  }
  return matches;
}

//TODO: 1. Matches are per paragraph, chapters are used for filtering and age only
export function mapFoodToPointsOnSameCoordinates(points: FunnyEntry[], foodMatches: ChapterQueryResults[]) {
  const pointMap = new Map<string, FoodPoint>();

  const pointsToConsider = points.filter(point => !!point.startParagraph && !!point.endParagraph)
  for (const point of pointsToConsider) {

    // find the food entry for this points book position
    const matches = findMatchesInSamePoint(point, foodMatches);
    if (!matches) {
      continue;
    }

    const foodCatsOnPoint = matches.flatMap(foods => foods.map(food => groupFoods[food])).filter(x => x)
    // foodCatsOnPoint is now a list like [cow, sheep, cow, cow, snake]

    // if we have a point from another chapter on the same coordinates, just add the foods
    // else create a new entry
    let coordString = '';
    //append all coordinates to an identifiable string, for lookup
    for (let i = 0; i < point.coords.length; i++) {
      coordString += point.coords[i]
    }
    const entry = pointMap.get(coordString);
    if (entry) {
      entry.foods.push(...foodCatsOnPoint);
    } else {
      pointMap.set(coordString, {
        coords: [...point.coords],
        locName: point.labelName,
        foods: foodCatsOnPoint,
        type: point.type
      });
    }
  }

  const result = Array.from(pointMap.values());
  for (const entry of result) {
    entry.foods.sort();
  }
  return result;
}

function isStringArrayArray(x: unknown): x is string[][] {
  return !!x && Array.isArray(x) && x.every(Array.isArray) && x.every(arr => typeof arr[0] === 'string');
}

export function countFoodInPoint(foodPoints: FoodPoint[]): countedFoodPoint[] {
  const theRetour: countedFoodPoint[] = [];
  foodPoints.forEach(
    (foodPoint) => {
      const theFoods = new Map<string, number>();
      foodPoint.foods.forEach(food => {
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