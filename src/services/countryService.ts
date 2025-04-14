import HttpService from '@/core/services/http/http.service';
import { ICountryDict } from '@/types/dictionaryTypes';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { RESTCOUNTRIES_API } from './api';

const COUNTRY_API_URL = `${RESTCOUNTRIES_API}/v3.1/all`;
const http = new HttpService();

export const fetchCountryAll$ = <T>(): Observable<ICountryDict[]> => {
  return from(http.get<T[]>(COUNTRY_API_URL)).pipe(
    switchMap((countries: T[]) =>
      of(
        countries?.map((country, i) => {
          const { name, cca2, cca3, flag, flags, latlng, capital, capitalInfo = {}, currencies = {} } = (country as any) || {};
          const currencyName = Object.keys(currencies ?? {})?.[0] ?? null;
          return {
            id: i + 1,
            country: name?.common ?? null,
            displayName: name?.common ?? null,
            cca2: cca2 ?? null,
            cca3: cca3 ?? null,
            flag: flag ?? null,
            flags: flags?.svg ?? null,
            latlng: latlng ?? null,
            capital: capital?.[0] ?? null,
            capitalLatlng: capitalInfo?.latlng ?? null,
            currencyName,
            currencySymbol: currencies?.[currencyName]?.symbol ?? null,
          };
        })
      )
    ),
    catchError((error) => {
      console.error('Error fetching countries:', error);
      return throwError(() => new Error('Failed to fetch countries.'));
    })
  );
};
