import { IMarket } from '@/types/marketTypes';
import { create } from 'zustand';

type MarketState = {
  exchanges: IMarket[];
  updateMarkets: (data: IMarket[]) => void;
};

export const useMarketStore = create<MarketState>((set) => ({
  exchanges: [],
  updateMarkets: (data) => set({ exchanges: data }),
}));
