import { create } from "zustand";

interface WorldDataState {
  worldData?: {
    fifty: {
      land: any;
      interiors: any;
    };
    hundred: {
      land: any;
      interiors: any;
    };
  } | null;
  ghostLinesEnabled: boolean;
}

interface WorldDataActions {
  setWorldData: (
    data: {
      fifty: {
        land: any;
        interiors: any;
      };
      hundred: {
        land: any;
        interiors: any;
      };
    } | null
  ) => void;
  setGhostLineEnabled: (ghost: boolean) => void;
}

export const useWorldDataStore = create<WorldDataState & WorldDataActions>(
  (set) => ({
    worldData: undefined,
    setWorldData: (
      worldData: {
        fifty: {
          land: any;
          interiors: any;
        };
        hundred: {
          land: any;
          interiors: any;
        };
      } | null
    ) => {
      set({ worldData });
    },
    ghostLinesEnabled: false,
    setGhostLineEnabled: (ghost: boolean) => {
      set({ ghostLinesEnabled: ghost });
    },
  })
);
