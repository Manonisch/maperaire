import { create } from "zustand";
import { ChapterQueryResults } from "../components/types";
import { Food } from "../data/querys/positions_food_final";
import { foodGroups } from "../components/foodQuery";

export type Querys = "default" | "Food";

export const queryRefs: Record<string, ChapterQueryResults[]> = {
  default: [],
  Food: Food,
};

export const dataSetMinimizers = {
  default: [],
  Food: [foodGroups],
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
