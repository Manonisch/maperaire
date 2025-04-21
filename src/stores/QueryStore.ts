import { create } from "zustand";
import { Food } from "../data/querys/positions_food_final";
import { BookPosition } from "../components/types";

export type Querys = "default" | "Food";

export const queryRefs: Record<string, BookPosition[]> = {
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
