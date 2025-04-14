interface IExchangeRates {
  [currency: string]: number;
}

interface IRatesByDate {
  [date: string]: IExchangeRates;
}

export interface ICurrencyHistoryRatesResponse {
  amount?: number;
  base?: string;
  start_date?: string;
  end_date?: string;
  rates?: IRatesByDate;
}
export interface IExchangeRateVolume {
  [name: string]: number;
}

export interface IExchangeRate {
  date: string;
  volume: IExchangeRateVolume;
}
