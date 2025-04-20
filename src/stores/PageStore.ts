import { create } from "zustand";

type Pages = "map" | "sources";

export interface Page {
  page: Pages;
  gotoPage: (page: Pages) => void;
}

export const usePage = create<Page>((set) => ({
  page: "map",
  gotoPage: (page: Pages) => {
    console.log("setting the page", page);
    set({ page });
  },
}));
