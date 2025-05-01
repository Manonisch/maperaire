import { create } from "zustand";
import { book, FunnyEntry } from "../components/types";
import chapter_labels from "../data/points_and_paths/chapter_labels";

interface DataPointStoreActions {
  allRelevantElements: FunnyEntry[]
}

interface DataPointStoreStates {
  storeAllRelevantElements: () => void
}

export const useDataPointsStore = create<DataPointStoreStates & DataPointStoreActions>((set, get) => ({
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
}));