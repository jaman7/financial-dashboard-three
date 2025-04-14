import { IParams } from '@/core/services/http/http.models';
import HttpService from '@/core/services/http/http.service';
import { ICurrencyHistoryRatesResponse, IExchangeRate } from '@/types/exchangeTypes';
import { catchError, from, map, Observable, of } from 'rxjs';
import { FRANKFURTER_API } from './api';

export const fetchExchangeRatesData$ = (baseCurrency: string = 'USD', days: number = 10): Observable<IExchangeRate[] | null> => {
  const http = new HttpService();
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);
  const formattedStart = startDate.toISOString().split('T')[0];
  const formattedEnd = today.toISOString().split('T')[0];
  const params: IParams = {
    from: baseCurrency,
  };
  const url = `${FRANKFURTER_API}/${formattedStart}..${formattedEnd}`;

  return from(http.get<ICurrencyHistoryRatesResponse | null>(url, params)).pipe(
    map((response) => {
      const rates =
        Object.entries(response?.rates ?? [])?.map(([date, value]: any) => ({
          date,
          volume: value ?? null,
        })) ?? [];

      if (!rates || rates.length === 0) {
        console.warn('Rates are empty, skipping updateExchangeRate');
        return []; // 🔴 Nie próbujemy aktualizować pustymi danymi
      }

      return (rates?.filter((r) => r.volume !== null) ?? []) as IExchangeRate[];
    }),
    catchError((error) => {
      console.error('Invalid response StockData from FRANKFURTER API:', error);
      return of([]);
    })
  );
};
