import { create } from "zustand";

interface InterestingLabelStore {
  interestingLabel: string | null,
  setInterestingLabel: (label: string | null) => void,
}

export const useInterestingLabelStore = create<InterestingLabelStore>((set) => ({
  interestingLabel: null,
  setInterestingLabel: (label: string | null) => {
    set({ interestingLabel: label });
  },
}));
