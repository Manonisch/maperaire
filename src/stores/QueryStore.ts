import { create } from "zustand";
import { Food } from "../data/querys/positions_food_final";
import { Test } from "../data/querys/positions_test";
import { Will } from "../data/querys/positions_Will";

export type Querys = "Will" | "Test" | "default";

export interface BookPosition {
  bookIndex: number;
  chapterIndex: number;
  matches?: string[] | string[][];
  length?: number;
}

export const queryRefs: Record<string, BookPosition[]> = {
  default: [],
  Will: Will,
  Test: Test,
  Food: Food,
};

export interface Query {
  query: Querys;
  chooseQuery: (query: Querys) => void;
}

export const useQuery = create<Query>((set) => ({
  query: "default",
  chooseQuery: (query: Querys) => {
    set({ query });
  },
}));
