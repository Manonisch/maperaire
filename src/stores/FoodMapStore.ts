import { create } from "zustand";

interface FoodMapAction {
  setSelectedOption: (selectedOptions: string[]) => void;
  changeSelectedOption: (selectedOption: string) => void;
}

interface FoodMapState {
  selectedOptions: string[];
}

export const useFoodMapStore = create<FoodMapAction & FoodMapState>(
  (set, get) => ({
    selectedOptions: [],
    setSelectedOption: (selectedOptions) => {
      set({ selectedOptions });
    },
    changeSelectedOption: (selectedOption) => {
      const { selectedOptions } = get();
      const foo = [...selectedOptions];
      const index = foo.indexOf(selectedOption);
      if (index > -1) {
        foo.splice(index, 1);
      } else {
        foo.push(selectedOption);
      }
      set({ selectedOptions: foo });
    },
  })
);
