import { create } from "zustand";

interface DragonMapAction {
  setSelectedDragonOption: (selectedOptions: string[]) => void;
  changeSelectedDragonOption: (selectedOption: string) => void;
  resetDragonFilters: () => void;
}

interface DragonMapState {
  selectedDragonOptions: string[];
}

export const useDragonMapStore = create<DragonMapAction & DragonMapState>(
  (set, get) => ({
    selectedDragonOptions: [],
    setSelectedDragonOption: (selectedOptions) => {
      set({ selectedDragonOptions: selectedOptions });
    },
    changeSelectedDragonOption: (selectedOption) => {
      const { selectedDragonOptions: selectedOptions } = get();
      const foo = [...selectedOptions];
      const index = foo.indexOf(selectedOption);
      if (index > -1) {
        foo.splice(index, 1);
      } else {
        foo.push(selectedOption);
      }
      set({ selectedDragonOptions: foo });
    },
    resetDragonFilters: () => {
      set({ selectedDragonOptions: [] })
    }
  })
);


