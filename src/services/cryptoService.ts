import { IParams } from '@/core/services/http/http.models';
import HttpService from '@/core/services/http/http.service';
import { coinsLists } from '@/data/data';
import { convertToCamelCase } from '@/shared/utils/data-fetch-convert';
import { CoinGeckoMarketChartRes, CryptoHistorySummary, CryptoListRes, ICryptoData, ICryptoDataRes } from '@/types/cryptoTypes';
import { ICryptoDict } from '@/types/dictionaryTypes';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { COINGECO_API, COINGECO_KEY } from './api';

export const fetchCryptoCoinListData$ = (): Observable<ICryptoDict[]> => {
  const http = new HttpService();
  const params: IParams = {
    x_cg_demo_api_key: COINGECO_KEY,
  };
  const url = `${COINGECO_API}/coins/list`;

  return from(http.get<CryptoListRes[]>(url, params)).pipe(
    map((response) => {
      if (!response || !response?.length) {
        return [];
      }
      return (
        response
          ?.filter((item) => coinsLists.indexOf(item?.symbol) !== -1)
          ?.map((el, i) => ({ id: i + 1, displayName: el.name, symbol: el.symbol, dataId: el.id })) ?? []
      );
    }),
    catchError((error) => {
      console.error('Invalid response from CoinGecko API', error);
      return of([]);
    })
  );
};

export const fetchCryptoSummaryData$ = <T>(id: string): Observable<ICryptoData | object> => {
  const http = new HttpService();
  const params: IParams = {
    x_cg_demo_api_key: COINGECO_KEY,
  };
  const url = `${COINGECO_API}/coins/${id.toLowerCase()}`;

  return from(http.get<ICryptoDataRes>(url, params)).pipe(
    map((response) => {
      if (!response) {
        return {};
      }
      const data = (convertToCamelCase(response as T) as ICryptoData) ?? {};
      return data;
    }),
    catchError((error) => {
      console.error('Invalid response coins from CoinGecko API', error);
      return of({});
    })
  );
};

export const fetchCryptoHistoryData$ = (id: string, currency: string, days: number = 7): Observable<CryptoHistorySummary[]> => {
  const http = new HttpService();
  const params: IParams = {
    vs_currency: currency.toLowerCase(),
    days: days,
    x_cg_demo_api_key: COINGECO_KEY,
  };
  const url = `${COINGECO_API}/coins/${id.toLowerCase()}/market_chart`;

  return from(http.get<CoinGeckoMarketChartRes>(url, params)).pipe(
    map((response) => {
      if (!response) {
        return [];
      }
      return (
        response?.prices?.map(([timestamp, price]: [number, number]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price,
        })) ?? []
      );
    }),
    catchError((error) => {
      console.error('Invalid response market_chart from CoinGecko API', error);
      return of([]);
    })
  );
};
