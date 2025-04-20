import { create } from "zustand";
import { Food } from "../data/querys/positions_food_final";
import { Test } from "../data/querys/positions_test";
import { Will } from "../data/querys/positions_Will";
import { BookPosition } from "../components/types";

export type Querys = "Will" | "Test" | "default" | "Food";

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
