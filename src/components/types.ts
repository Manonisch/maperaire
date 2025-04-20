export interface LocLabel {
  labelName: string;
  coords: number[];
  type: string;
  file?: string;
  char?: string;
  centrality?: "implied";
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

export interface BookPosition {
  bookIndex: number;
  chapterIndex: number;
  matches?: string[][] | string[]; //per result, save all labels as strings
  length?: number;
}

export type ChapterType = "chapter" | "prologue" | "epilogue" | "appendix";

export type Chapterus = {
  bookIndex: number;
  chapterIndex: number;
  name: string;
  type: ChapterType;
};
