import { create } from "zustand";

interface SliderStoreState {
  end?: number;
  start?: number;
}

interface SliderStoreActions {
  setEnd: (end: number) => void;
  setStart: (start: number) => void;
}
export const useSliderStore = create<SliderStoreActions & SliderStoreState>(
  (set) => ({
    end: undefined,
    start: undefined,
    setEnd: (end: number) => {
      set({ end });
    },
    setStart: (start: number) => {
      set({ start });
    },
  })
);
