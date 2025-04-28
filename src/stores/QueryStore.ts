import { create } from "zustand";
import { ChapterQueryResults } from "../components/types";
import { Food } from "../data/querys/positions_food_final";

export type Querys = "default" | "Food";

export const queryRefs: Record<string, ChapterQueryResults[]> = {
  default: [],
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
