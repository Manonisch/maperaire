import { create } from "zustand";

interface CharacterMapAction {
  setSelectedCharacterOption: (selectedOptions: string[]) => void;
  changeSelectedCharacterOption: (selectedOption: string) => void;
  resetCharacterFilters: () => void;
}

interface CharacterMapState {
  selectedCharacterOptions: string[];
}

export const useCharacterMapStore = create<CharacterMapAction & CharacterMapState>(
  (set, get) => ({
    selectedCharacterOptions: [],
    setSelectedCharacterOption: (selectedOptions) => {
      set({ selectedCharacterOptions: selectedOptions });
    },
    changeSelectedCharacterOption: (selectedOption) => {
      const { selectedCharacterOptions: selectedOptions } = get();
      const foo = [...selectedOptions];
      const index = foo.indexOf(selectedOption);
      if (index > -1) {
        foo.splice(index, 1);
      } else {
        foo.push(selectedOption);
      }
      set({ selectedCharacterOptions: foo });
    },
    resetCharacterFilters: () => {
      set({ selectedCharacterOptions: [] })
    }
  })
);


