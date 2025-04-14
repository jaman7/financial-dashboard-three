import { IButtonsTimeFrameType } from '@/components/Shared/FiltersChartButtons/FiltersChartButtons.types';
import { IParams } from '@/core/services/http/http.models';
import HttpService from '@/core/services/http/http.service';
import { convertTimeframeToPolygoIo } from '@/shared/utils/data-fetch-convert';
import { getCurrentDate, getPastDate } from '@/shared/utils/date-utils';
import { HistoricalStockData, StockData, StockListData } from '@/store/useStockStore';
import { TimeFrameTypes } from '@/types/dictionaryTypes';
import {
  GainersApiType,
  IHistoricalBarsAlpacaResponse,
  IStockBarsAlpaca,
  IStockBarsAlpacaResponse,
  IStockHistoryBarsAlpaca,
  IStocksProfile,
  ITopStockGainers,
} from '@/types/stockTypes';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ALPACA_API,
  ALPACA_HEADERS,
  FINANCIALMODELINGPREP_API,
  FINANCIALMODELINGPREP_KEY,
  FINNHUB_API,
  FINNHUB_KEY,
  POLYGON_API,
  POLYGON_KEY,
} from './api';

interface PolygonStockTickersEntry {
  active?: boolean;
  cik?: string;
  composite_figi?: string;
  currency_name?: string;
  last_updated_utc?: string;
  locale?: string;
  market?: string;
  name?: string;
  primary_exchange?: string;
  share_class_figi?: string;
  ticker?: string;
  type?: string;
  symbol?: string;
  change?: number;
  price?: number;
  changesPercentage?: number;
}

export const fetchStockSummaryData$ = (symbol: string): Observable<StockData> => {
  const http = new HttpService();
  const params: IParams = {
    apiKey: POLYGON_KEY,
  };
  const url = `${POLYGON_API}/v2/aggs/ticker/${symbol}/prev`;

  return from(http.get<any>(url, params)).pipe(
    map((response) => {
      const quote = response.results[0];
      return {
        symbol: symbol,
        open: quote.o,
        high: quote.h,
        low: quote.l,
        price: quote.c,
        volume: quote.v,
        latestTradingDay: new Date(quote.t).toISOString().split('T')[0],
        previousClose: quote.o,
        change: quote.c - quote.o,
        changePercent: (((quote.c - quote.o) / quote.o) * 100).toFixed(2) + '%',
      };
    }),
    catchError((error) => {
      console.error('Invalid response StockData from Polygon API:', error);
      return of({});
    })
  );
};

export const fetchHistoricalStockData$ = (symbol: string, days: number, timeframe: TimeFrameTypes): Observable<HistoricalStockData[]> => {
  const http = new HttpService();
  const params: IParams = {
    apiKey: POLYGON_KEY,
  };
  const url = `${POLYGON_API}/v2/aggs/ticker/${symbol}/range/${convertTimeframeToPolygoIo(timeframe)}/${getPastDate(days)}/${getCurrentDate()}`;

  return from(http.get<any>(url, params)).pipe(
    map((response) => {
      return (
        response?.results?.map((entry: any) => ({
          name: new Date(entry.t).toISOString().split('T')[0],
          date: new Date(entry.t).toLocaleDateString(),
          volume: entry.v,
          price: entry.c,
        })) ?? []
      );
    }),
    catchError((error) => {
      console.error('Invalid response HistoricalStockData from Polygon API:', error);
      return of([]);
    })
  );
};

export const fetchStockListData$ = (
  options: {
    ticker?: string | string[] | null;
    type?: string | null;
    market?: string | null;
    order?: string | null;
    sort?: string | null;
    limit?: number | null;
    active?: boolean | null;
    search?: string | string[] | null;
  } = {}
): Observable<StockListData[]> => {
  const http = new HttpService();
  const params: IParams = {
    apikey: FINANCIALMODELINGPREP_KEY,
  };
  const param = { ...params, ...options };
  const url = `${FINANCIALMODELINGPREP_API}/api/v3/stock_market/actives`;

  return from(http.get<PolygonStockTickersEntry[]>(url, param)).pipe(
    map((response) => {
      return (
        response?.map((entry, i) => ({
          ...entry,
          id: i + 1,
          displayName: entry.symbol,
        })) ?? []
      );
    }),
    catchError((error) => {
      console.error('Invalid response StockListData from Polygon API:', error);
      return of([]);
    })
  );
};

export const fetchTopStocksTickers$ = (type: GainersApiType = 'gainers'): Observable<ITopStockGainers[]> => {
  const http = new HttpService();
  const url = `${FINANCIALMODELINGPREP_API}/api/v3/stock_market/${type}`;
  const params: IParams = {
    apikey: FINANCIALMODELINGPREP_KEY,
  };

  return from(http.get<ITopStockGainers[]>(url, params)).pipe(
    map((response) => {
      return response ?? [];
    }),
    catchError((error) => {
      console.error('Invalid response from FMP API:', error);
      return of([]);
    })
  );
};

export const fetchStocksBarDataAlpacaLatest$ = (params: IParams): Observable<IStockBarsAlpaca> => {
  const http = new HttpService();
  const url = `${ALPACA_API}/stocks/bars/latest`;

  return from(http.get<IStockBarsAlpacaResponse>(url, params, ALPACA_HEADERS)).pipe(
    map((response) => {
      return response.bars ?? {};
    }),
    catchError((error) => {
      console.error('Invalid response from FMP API:', error);
      return of({});
    })
  );
};

export const fetchHistoricalBarsDataAlpaca$ = (
  symbols: string | string[] = 'AAPL',
  timeframe: IButtonsTimeFrameType = '1D',
  days: number = 30
): Observable<IStockHistoryBarsAlpaca> => {
  const today = new Date();
  const startDate = new Date();
  startDate.setUTCDate(today.getUTCDate() - days);

  // Formatowanie dat do pełnego ISO 8601 UTC (YYYY-MM-DDTHH:mm:ssZ)
  const formattedStart = new Date(
    Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 0, 0, 0)
  ).toISOString();
  const formattedEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0)).toISOString();

  const http = new HttpService();
  const url = `${ALPACA_API}/stocks/bars`;

  const params: IParams = {
    symbols,
    start: formattedStart,
    end: formattedEnd,
    timeframe,
    sort: 'asc',
    limit: 10000,
  };

  return from(http.get<IHistoricalBarsAlpacaResponse>(url, params, ALPACA_HEADERS)).pipe(
    map((response) => {
      return response.bars ?? {};
    }),
    catchError((error) => {
      console.error('Invalid response from FMP API:', error);
      return of({});
    })
  );
};

export const fetchProfileDataFinhub$ = (symbol: string | string[] = 'AAPL'): Observable<IStocksProfile> => {
  const http = new HttpService();
  const url = `${FINNHUB_API}/v1/stock/profile2`;

  const params: IParams = {
    symbol,
    token: FINNHUB_KEY,
  };

  return from(http.get<IStocksProfile>(url, params)).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Invalid response from Finhub Profile API:', error);
      return of({});
    })
  );
};
