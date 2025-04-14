import { IDictionaries } from '@/types/dictionaryTypes';
import { create } from 'zustand';

type IDictionaryState = {
  dictionary: IDictionaries;
  updateDictionary: (data: Partial<IDictionaries>) => void;
};

export const useDictionaryStore = create<IDictionaryState>((set) => ({
  dictionary: {},
  updateDictionary: (data) =>
    set((state) => {
      return { dictionary: { ...state.dictionary, ...data } };
    }),
}));
