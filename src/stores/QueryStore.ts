import { create } from "zustand";
import { ChapterQueryResults } from "../components/types";
import { foodGroups } from "../components/foodQuery";
import { Food } from "../data/querys/positions_food_final";
import { charsData } from "../data/querys/positions_char_granby_tharkay_jane";
import { characterGroups } from "../components/characterjourneys/CharacterStatics";

export type Querys = "default" | "Food" | 'Characters';

export const queryRefs: Record<string, ChapterQueryResults[]> = {
  default: [],
  Food: Food,
  Characters: charsData
};

export const dataSetMinimizers = {
  default: [],
  Food: [foodGroups],
  Characters: [characterGroups]
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
