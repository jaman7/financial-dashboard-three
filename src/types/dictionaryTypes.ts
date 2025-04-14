export interface ICurrencyDict {
  id?: number;
  displayName?: string;
  symbol?: string;
  country?: string;
  cca2?: string;
  cca3?: string;
  flag?: string;
  flags?: string;
  latlng?: number[];
  capital?: string;
  capitalLatlng?: number[];
  currencyName?: string;
  currencySymbol?: string;
}

export interface ICountryDict {
  id: number;
  country: string;
  displayName: string;
  cca2: string;
  cca3: string;
  flag: string;
  flags: string;
  latlng: number[];
  capital: string;
  capitalLatlng: number[];
  currencyName: string;
  currencySymbol: string;
}
export interface ICryptoDict {
  id: number;
  displayName: string;
  symbol: string;
  dataId: string;
}

export interface IStockDict {
  id: number;
  symbol: string;
  name: string;
  change: number;
  price: number;
  changesPercentage: number;
  displayName: string;
}

export interface IDictionaries {
  currencyDict?: ICurrencyDict[];
  countryDict?: ICountryDict[];
  cryptoDict?: ICryptoDict[];
  stockDict?: IStockDict[];
}

export type TimeFrameTypes = '1H' | '6H' | '12H' | '1D' | '1W';

export const timeframeMap: Record<TimeFrameTypes, string> = {
  '1H': '1/hour',
  '6H': '5/hour',
  '12H': '12/hour',
  '1D': '1/day',
  '1W': '1/week',
};
