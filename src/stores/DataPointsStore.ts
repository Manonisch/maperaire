import { create } from "zustand";
import { book, ChapterQueryResults, FunnyEntry, outputResult } from "../components/types";
import chapter_labels from "../data/points_and_paths/chapter_labels";
import { Querys } from "./QueryStore";
import { GlobalChapterInterval } from "./SliderStore";
import { getBookPosition, isInRange } from "../components/utils";

//this is the data from the querystory, reduced to already only have grouped labels
export const MinimalGroupedData: ChapterQueryResults[] = [];

interface DataPointStoreStates {
  allRelevantElements: FunnyEntry[],
  locations: FunnyEntry[],
  locationData: LocationData[],
  characterLocationData: CharacterLocationData[],
}

interface DataPointStoreActions {
  storeAllRelevantElements: () => void;
  updateRelevantData: (query: Querys, filter: FilterConfig, slider: GlobalChapterInterval) => void;
  minimalizeDataSet: (dataSet: ChapterQueryResults[], minimalizer: Map<string, string[]>[]) => void;
}

interface FilterConfig {
  filter: string[][] // [string OR string] AND [string OR string]
}

export const useDataPointsStore = create<DataPointStoreStates & DataPointStoreActions>((set) => ({
  allRelevantElements: [],
  storeAllRelevantElements: () => {
    const books = chapter_labels.books as book[];

    const theLocLabels: FunnyEntry[] = [];
    books.forEach((book, bookI) => {
      book.chapters.forEach((chapter) => {
        // if a locLabel has no endParagraph, it won't have a match (food) and then we are not going to need it
        const filteredLocLabels = chapter.locLabels.filter(label => label.endParagraph)
        filteredLocLabels.forEach(loccer => {
          const foo: FunnyEntry = { ...loccer };
          foo.chapterIndex = chapter.index;
          foo.bookIndex = bookI;
          theLocLabels.push(foo);
        });
      });
    });
    set({ allRelevantElements: theLocLabels });
  },

  locations: [],
  locationData: [],
  characterLocationData: [],

  updateRelevantData: (query: Querys, filters: FilterConfig, chapterInterval: GlobalChapterInterval) => {
    if (query === 'default') {
      // chapterInterval decides which points and paths and regions are considered
      const locations = transformBooksToLocations(chapter_labels.books as book[])
        .filter(location => isInRange(location, {
          start: getBookPosition(chapterInterval.start),
          end: getBookPosition(chapterInterval.end),
          positionList: []
        })
        );

      set({ locations, locationData: [], characterLocationData: [] });
    } else if (query === 'Food') {

      const hasFilter = !!filters.filter?.length;
      // filter decides which "food groups / food preparations" are relevant (all or some)
      const filteredData = hasFilter ? filterDataSet(MinimalGroupedData, filters) : MinimalGroupedData

      // get all locations
      // chapterInterval decides which points and paths and regions are considered
      // THESE SHOULD BE ENOUGH TO RETURN TO DRAW THE FILTERED BASEMAP
      const locations = transformBooksToLocations(chapter_labels.books as book[])
        .filter(location => isInRange(location, {
          start: getBookPosition(chapterInterval.start),
          end: getBookPosition(chapterInterval.end),
          positionList: hasFilter ? filteredData : []
        })
        );

      // relevant "foods" are mapped on points and paths
      const locationData = mapDataSetToLocations(locations, filteredData);

      set({ locationData, locations, characterLocationData: [] });
    } else if (query === 'Characters') {
      //TODO: All Data should be returned, since we need to calculate something about the implied and inbetween paths!

      // If there's two points/paths where the character is mentioned, add the character as (weak) to the path between these two points
      // If there's n implied path between two points/paths where a character is mentioned -> add the character to the implied path as (weak)
      // if there's n implied path two points paths where character is implicated to have been, add character to implied path

      // Only

      const hasFilter = !!filters.filter?.length;
      // filter decides which "food groups / food preparations" are relevant (all or some)
      const filteredData = hasFilter ? filterDataSet(MinimalGroupedData, filters) : MinimalGroupedData

      // get all locations
      // chapterInterval decides which points and paths and regions are considered
      // THESE SHOULD BE ENOUGH TO RETURN TO DRAW THE FILTERED BASEMAP
      const locations = transformBooksToLocations(chapter_labels.books as book[])
        .filter(location => isInRange(location, {
          start: getBookPosition(chapterInterval.start),
          end: getBookPosition(chapterInterval.end),
          positionList: []
        })
        );

      // relevant "characters" are mapped on points and paths
      const characterLocationData = mapCharacterDataSetToLocations(locations, filteredData);

      set({ locationData: [], characterLocationData, locations });
    }
  },

  minimalizeDataSet: (dataSet, minimalizer) => {
    //Minimize data for all set minimalizers
    const combMin = combineAndReverseMinimalizers(minimalizer);
    const minimizedData = minimizeDataSet(dataSet, combMin);

    //clear the array
    MinimalGroupedData.splice(0, MinimalGroupedData.length);
    MinimalGroupedData.push(...minimizedData);
  },
}));

// query - dragonreader query pattern (\bdragon\S*\b)
// match - all found matches for this query (dragon, dragons, dragonnette, dragon-egg)
// result - a match together with a paragraph book chapter + labels
// label - arbitrary string list attached to result, includes match as a label string, adds more label strings ([camel, stewed, with vegetables, delicious])
// chapterInterval - slider start and slider end as global paragraph indices, can filter results
// filter - string list to match on labels
//
// positions -

// RENAMING TODOs
// * rename Query* to Topic, because Query in DragonReader is the actual text search pattern
//   and the Maperaire "Query" is a fixed list of Topics to work on


// [string OR string] AND [string OR string]
function filterDataSet(dataSet: ChapterQueryResults[], filter: FilterConfig): ChapterQueryResults[] {
  const filteredByChapter = dataSet.filter(dataEntry => {
    return dataEntry.matches?.some(result => { // these are results!
      return filter.filter.every(singleFilter => {
        return result.labels.some(label => singleFilter.includes(label))
      });
    })
  });

  return filteredByChapter.map(dataEntry => {
    const matches = dataEntry.matches?.filter(result => {
      return filter.filter.every(singleFilter => {
        return result.labels.some(label => singleFilter.includes(label))
      });
    })
    return { ...dataEntry, matches }
  })
}

function combineAndReverseMinimalizers(minimalizer: Map<string, string[]>[]): Map<string, string> {
  const combinedMinimalizer = new Map();
  minimalizer.forEach(minime => {
    minime.forEach((values: string[], key) => {
      values.forEach(value => {
        combinedMinimalizer.set(value, key);
      });
    })
  })
  return combinedMinimalizer;
}

function minimizeDataSet(dataSet: ChapterQueryResults[], minimizer: Map<string, string>): ChapterQueryResults[] {
  return dataSet.map(dataEntry => {
    const matches = dataEntry.matches?.map((match) => {
      const labels = match.labels.map(label => {
        return minimizer.get(label) ?? label;
      })
      return { ...match, labels };
    })
    return { ...dataEntry, matches };
  })
}

function transformBooksToLocations(books: book[]): FunnyEntry[] {
  const locations: FunnyEntry[] = [];
  books.forEach((book, bookIndex) => {
    book.chapters.forEach((chapter) => {
      chapter.locLabels.forEach(locLabel => {
        locations.push({
          ...locLabel,
          chapterIndex: chapter.index,
          bookIndex: bookIndex,
        });
      });
    });
  });
  return locations;
}

export interface LocationData {
  coords: number[];
  locName: string;
  labels: string[];
  type: string;
}

export interface CharacterLocationData extends Omit<LocationData, "labels"> {
  labels: LabelAssociation[]
}

export interface LabelAssociation {
  label: string;
  weak: boolean;
}

interface CharacterLocation {
  bookIndex: number;
  char: string; // TODO this is the POV, may be combined
  labels: LabelAssociation[]; // TODO strong or weak?
  coords: number[];
  type: string;
  locName: string;
  implied: boolean;
}

function mapCharacterDataSetToLocations(locations: FunnyEntry[], dataSet: ChapterQueryResults[]): CharacterLocationData[] {
  // all locations have all labels from results

  const journey: CharacterLocation[] = [];
  for (const location of locations) {
    if (location.type === 'region') {
      continue;
    }
    const results = findResultsInSameLocation(location, dataSet);

    const allLabels = [...new Set(results.flatMap(result => result.labels))]
    const labels = allLabels.map(label => ({ label: label, weak: false }));
    if (typeof location.bookIndex === 'undefined') {
      throw new Error('nooo');
    }

    journey.push({
      bookIndex: location.bookIndex,
      char: location.char || 'combined',
      implied: !!location.centrality,
      labels: labels,
      coords: [...location.coords],
      type: location.type,
      locName: location.labelName,
    });
  }

  // If there's two points/paths where the character is mentioned, add the character as (weak) to the path between these two points
  // If there's n implied path between two points/paths where a character is mentioned -> add the character to the implied path as (weak)
  // if there's n implied path two points paths where character is implicated to have been, add character to implied path
  // If implied path is the first point in a book, throw and show

  function containsLabel(search: LabelAssociation, labels: LabelAssociation[]): boolean {
    return labels.some(label => label.label === search.label);
  }

  journey.forEach((location, index) => {
    const prev = journey[index - 1];
    let next = journey[index + 1];
    if (!prev || !next) {
      return;
    }
    if (prev.bookIndex !== location.bookIndex) {
      return;
    }

    //if current is implied and next is implied, go to the one after next
    let runner = 1;
    while (location.implied && next.implied && runner < 3) {
      runner += 1;
      if (journey[index + runner]) {
        next = journey[index + runner]
      }
    }

    const theLabels = prev.labels.filter(label => containsLabel(label, next.labels) && !containsLabel(label, location.labels));

    for (const label of theLabels) {
      location.labels.push({ label: label.label, weak: true });
    }
  });

  type Coord = string;
  const dataMap = new Map<Coord, CharacterLocationData>();
  for (const location of journey) {
    const coordString: Coord = location.coords.join(' ');

    const entry = dataMap.get(coordString);
    if (entry) {
      entry.labels.push(...location.labels);
    } else {
      dataMap.set(coordString, {
        coords: [...location.coords],
        locName: location.locName,
        type: location.type,
        labels: [...location.labels],
      });
    }
  }

  return [...dataMap.values()];
}

function mapDataSetToLocations(locations: FunnyEntry[], dataSet: ChapterQueryResults[]): LocationData[] {
  type Coord = string;
  const dataMap = new Map<Coord, LocationData>();

  // go over every location and find for each location every data entry that is associated with that location

  for (const location of locations) {
    if (location.type === 'region') {
      continue;
    }

    const results = findResultsInSameLocation(location, dataSet);

    if (!results) {
      continue;
    }

    const labels = results.flatMap(result => result.labels); // TODO should we?

    // if we have a point from another chapter on the same coordinates, just add the foods
    // else create a new entry
    const coordString: Coord = location.coords.join(' ');

    const entry = dataMap.get(coordString);
    if (entry) {
      entry.labels.push(...labels);
    } else {
      dataMap.set(coordString, {
        coords: [...location.coords],
        locName: location.labelName,
        type: location.type,
        labels,
      });
    }
  }

  const result = Array.from(dataMap.values());
  for (const entry of result) {
    entry.labels.sort();
  }
  return result;
}
/**
  * Returns results as lists per map point/path
  * @param loclabel
  * @param results
  * @returns list of matches, each match is list of labels
  */
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