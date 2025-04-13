import { create } from "zustand";
import { Will } from "../data/querys/positions_Will";
import { Test } from "../data/querys/positions_test";

export type Querys = "Will" | "Test" | "";

export interface BookPosition {
  bookIndex: number;
  chapterIndex: number;
  matches?: string[];
}

export const queryRefs: Record<string, BookPosition[]> = {
  Will: Will,
  Test: Test,
  default: [],
};

export interface Query {
  query: Querys;
  chooseQuery: (query: Querys) => void;
}

export const useQuery = create<Query>((set) => ({
  query: "",
  chooseQuery: (query: Querys) => {
    set({ query });
  },
}));
