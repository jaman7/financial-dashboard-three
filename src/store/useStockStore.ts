import { create } from 'zustand';

export interface StockData {
  symbol?: string;
  open?: number;
  high?: number;
  low?: number;
  price?: number;
  volume?: number;
  latestTradingDay?: string;
  previousClose?: number;
  change?: number;
  changePercent?: string;
  name?: string;
}

export interface HistoricalStockData {
  name: string;
  volume: number;
  openInterest?: number;
  date: string;
  price: number;
}

export interface StockListData {
  id: number;
  name?: string;
  displayName?: string;
  symbol?: string;
  change?: number;
  price?: number;
  changesPercentage?: number;
}

export type StockState = {
  stock: StockData;
  historicalData: HistoricalStockData[];
  stockList: StockListData[];
  updateStockData: (data: StockData) => void;
  updateStockHistoricalData: (data: HistoricalStockData[]) => void;
  updateStockListData: (data: StockListData[]) => void;
};

export const useStockStore = create<StockState>((set) => ({
  stock: {},
  historicalData: [],
  stockList: [],
  updateStockData: (data) => set({ stock: data ?? {} }),
  updateStockHistoricalData: (data) => set({ historicalData: data ?? [] }),
  updateStockListData: (data) => set({ stockList: data ?? [] }),
}));
