export interface IConnections {
  name?: string | string[];
  coordinates?: [number, number, number];
}

export interface IMarket {
  id: number;
  name: string | string[] | null;
  coordinates?: [number, number, number];
  connections?: IConnections[];
  color?: string;
  countryCode?: string | null;
  cca3?: string | null;
  flag?: string | null;
  flagSrc?: string | null;
  description?: string | null;
  hasTradingIncentive?: boolean;
  image?: string | null;
  tradeVolume24hBtc?: number | null;
  tradeVolume24hBtcNormalized?: number | null;
  trustScore?: number | null;
  trustScoreRank?: number | null;
  url?: string | null;
  yearEstablished?: number | null;
  country?: string | null;
}

export interface IStock {
  id: number;
  displayName: string;
  symbol: string;
  value: number;
  change: number;
  icon: string;
}
