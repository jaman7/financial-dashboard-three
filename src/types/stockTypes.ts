export interface ITopStockGainers {
  symbol: string;
  price: number;
  name: string;
  change: number;
  changesPercentage: number;
  exchange: string;
}

export interface IStockBarAlpaca {
  c?: number;
  h?: number;
  l?: number;
  n?: number;
  o?: number;
  t?: string;
  v?: number;
  vw?: number;
  [name: string]: unknown;
}

export interface IStockBarsAlpaca {
  [symbol: string]: IStockBarAlpaca;
}

export interface IStockBarsAlpacaResponse {
  bars: IStockBarsAlpaca;
}

export interface IStockHistoryBarsAlpaca {
  [symbol: string]: IStockBarAlpaca[];
}

export interface IHistoricalBarsAlpacaResponse {
  bars?: IStockHistoryBarsAlpaca;
  next_page_token?: string | null;
}

export interface IStocksTickersAlpaca {
  ticker?: string;
  price?: number;
  high?: number;
  low?: number;
  volume?: number;
  timestamp?: string;
  date?: string;
  logo?: string | null;
}

export type GainersApiType = 'gainers' | 'losers' | 'actives';

export interface IStocksProfile {
  country?: string;
  currency?: string;
  estimateCurrency?: string;
  exchange?: string;
  finnhubIndustry?: string;
  ipo?: string;
  logo?: string;
  marketCapitalization?: number;
  name?: string;
  phone?: string;
  shareOutstanding?: number;
  ticker?: string;
  weburl?: string;
}
