
//TODO: WE NEED TO SERIOUSLY REFACTOR THESE TYPES!!!!!!!!!!!!!!!!!
export interface LocLabel {
  labelName: string;
  coords: number[];
  type: string;
  file?: string;
  char?: string;
  centrality?: "implied";
  startParagraph?: number;
  endParagraph?: number;
}

export interface FunnyEntry extends LocLabel {
  bookIndex?: number;
  chapterIndex?: number;
  matches?: string[];
}

export type ChapterEntry = {
  index: number;
  type: string;
  name: string;
  labels: string[];
  povLabels: string[];
  locLabels: LocLabel[];
};

export type book = {
  name: string;
  chapters: ChapterEntry[];
};


export interface outputResult {
  paragraphIndex: number,
  labels: string[]
}

// per chapter, stores all found mathches/results
export interface ChapterQueryResults {
  bookIndex: number;
  chapterIndex: number;
  matches?: outputResult[]; //per result, save all labels as strings
  length?: number;
}

export type ChapterType = "chapter" | "prologue" | "epilogue" | "appendix";

export type Chapterus = {
  bookIndex: number;
  chapterIndex: number;
  name: string;
  type: ChapterType;
};
