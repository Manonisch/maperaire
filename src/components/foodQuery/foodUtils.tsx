import { countedFoodPoint } from "./foodtypes";
import { ChapterQueryResults, FunnyEntry, outputResult } from "../types";
import { LocationData } from "../../stores/DataPointsStore";

//TODO: WE WILL NOT NEED THIS ANYMORE
export function prepareFood(data: ChapterQueryResults[], selectedFoodOptions: string[]) {
  const resultData = data?.filter(chapter => {
    if (chapter.matches) {
      const localMatches = chapter.matches.map(m => m.labels);

      const reducedMatches: string[] = localMatches.reduce(
        (accumulator, currentValue) => accumulator.concat(currentValue),
        [],
      );
      return reducedMatches.some(r => selectedFoodOptions.includes(r))
    }
    return false;
  })
  return resultData;
}

/**
  * Returns results as lists per map point/path
  * @param loclabel
  * @param results
  * @returns list of matches, each match is list of labels
  */
//TODO: MOVE THIS LOGIC?
export function findResultsInSameLocation(loclabel: FunnyEntry, results: ChapterQueryResults[]): outputResult[] {
  const { bookIndex, chapterIndex, startParagraph, endParagraph } = loclabel;
  if (typeof startParagraph !== 'number' || typeof endParagraph !== 'number') {
    return [];
  }

  const resultsInThisChapter = results.filter((chapter) => chapter.bookIndex == bookIndex && chapter.chapterIndex == chapterIndex);
  if (resultsInThisChapter.length > 1) {
    throw new Error('we only handle the case where a result belongs to a single chapter, instead ' + resultsInThisChapter.length);
  }
  if (!resultsInThisChapter.length) {
    return [];
  }

  const resultInThisChapter = resultsInThisChapter[0];
  const matchesForTheseParagraphs = resultInThisChapter.matches?.filter(match =>
    match.paragraphIndex >= startParagraph && match.paragraphIndex <= endParagraph
  ) ?? [];

  return matchesForTheseParagraphs;
}

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