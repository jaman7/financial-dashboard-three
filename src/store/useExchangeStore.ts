import { IExchangeRate } from '@/types/exchangeTypes';
import { create } from 'zustand';

type ExchangeState = {
  exchangeRate: IExchangeRate[];
  updateExchangeRate: (data: IExchangeRate[]) => void;
};

export const useExchangeStore = create<ExchangeState>((set) => ({
  exchangeRate: [],
  updateExchangeRate: (data) => set({ exchangeRate: data }),
}));
