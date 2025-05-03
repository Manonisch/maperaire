import { create } from "zustand";

interface FoodMapAction {
  setSelectedFoodOption: (selectedOptions: string[]) => void;
  changeSelectedFoodOption: (selectedOption: string) => void;
  setSelectedPrepOption: (selectedOptions: string[]) => void;
  changeSelectedPrepOption: (selectedOption: string) => void;
  setPrepFilter: (set: boolean) => void;
}

interface FoodMapState {
  selectedFoodOptions: string[];
  selectedPrepOptions: string[];
  prepFilter: boolean;
}

export const useFoodMapStore = create<FoodMapAction & FoodMapState>(
  (set, get) => ({
    selectedFoodOptions: [],
    setSelectedFoodOption: (selectedOptions) => {
      set({ selectedFoodOptions: selectedOptions });
    },
    changeSelectedFoodOption: (selectedOption) => {
      const { selectedFoodOptions: selectedOptions } = get();
      const foo = [...selectedOptions];
      const index = foo.indexOf(selectedOption);
      if (index > -1) {
        foo.splice(index, 1);
      } else {
        foo.push(selectedOption);
      }
      set({ selectedFoodOptions: foo });
    },
    selectedPrepOptions: [],
    setSelectedPrepOption: (selectedOptions) => {
      set({ selectedPrepOptions: selectedOptions });
    },
    changeSelectedPrepOption: (selectedOption) => {
      const { selectedPrepOptions: selectedOptions } = get();
      const foo = [...selectedOptions];
      const index = foo.indexOf(selectedOption);
      if (index > -1) {
        foo.splice(index, 1);
      } else {
        foo.push(selectedOption);
      }
      set({ selectedPrepOptions: foo });
    },
    setPrepFilter: (prepFilter) => {
      set({ prepFilter })
    },
    prepFilter: false,
  })
);