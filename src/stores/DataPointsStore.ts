import { create } from "zustand";
import { book, ChapterQueryResults, FunnyEntry } from "../components/types";
import chapter_labels from "../data/points_and_paths/chapter_labels";
import { Querys } from "./QueryStore";
import { GlobalChapterInterval } from "./SliderStore";

//this is the data from the querystory, reduced to already only have grouped labels
export const MinimalGroupedData: ChapterQueryResults[] = [];

interface DataPointStoreStates {
  allRelevantElements: FunnyEntry[],
  relevantData: RelevantData, // renderData?
}

interface RelevantData {

}

//

interface DataPointStoreActions {
  storeAllRelevantElements: () => void;
  updateRelevantData: (query: Querys, filter: Filter, slider: GlobalChapterInterval) => void;
  minimalizeDataSet: (dataSet: ChapterQueryResults[], minimalizer: Map<string, string[]>[]) => void;
}

interface Filter {
  filter?: string[]
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

  relevantData: {},

  updateRelevantData(query: Querys, filter: Filter, chapterInterval: GlobalChapterInterval) {
    // GLOSSARY:
    // * points and paths = FunnyEntry = LocLabel
    if (query === 'default') {
      // chapterInterval decides which points and paths and regions are considered
    } else if (query === 'Food') {
      // chapterInterval decides which points and paths and regions are considered

      // Gegeben: MinimalGroupedData
      // filter decides which "food groups / food preparations" are relevant (all or some)

      // relevant "foods" are mapped on points and paths
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
