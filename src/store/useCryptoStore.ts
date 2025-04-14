import { ICryptoData } from '@/types/cryptoTypes';
import { create } from 'zustand';

export interface CryptoSummaryHistoryData {
  date: string;
  price: number;
}

export type CryptoState = {
  cryptoData: ICryptoData;
  cryptoHistory: CryptoSummaryHistoryData[];
  updateCryptoData: (data: ICryptoData) => void;
  updateCryptoHistoryData: (data: CryptoSummaryHistoryData[]) => void;
};

export const useCryptoStore = create<CryptoState>((set) => ({
  cryptoData: {},
  cryptoHistory: [],
  updateCryptoData: (data) => set({ cryptoData: data }),
  updateCryptoHistoryData: (data) => set({ cryptoHistory: data }),
}));
