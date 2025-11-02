import { create } from "zustand";

type SavedState = {
  saved: string[];
  toggle: (id: string) => void;
  isSaved: (id: string) => boolean;
};

export const useSavedStore = create<SavedState>((set, get) => ({
  saved: [],
  toggle: (id) => {
    const next = get().saved.includes(id)
      ? get().saved.filter((item) => item !== id)
      : [...get().saved, id];
    set({ saved: next });
  },
  isSaved: (id) => get().saved.includes(id)
}));
