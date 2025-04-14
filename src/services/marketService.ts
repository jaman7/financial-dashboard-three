import { IParams } from '@/core/services/http/http.models';
import HttpService from '@/core/services/http/http.service';
import { colors } from '@/data/data';
import { mergeDuplicateExchanges } from '@/shared/utils/convertLatLngToVector';
import { ICountryDict } from '@/types/dictionaryTypes';
import { IMarket } from '@/types/marketTypes';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { COINGECO_API, COINGECO_KEY } from './api';
import { fetchCountryAll$ } from './countryService';

interface ICountryMarketsData {
  countries: ICountryDict[];
  markets: IMarket[];
}

export const fetchExchangeData$ = (): Observable<ICountryMarketsData> => {
  const http = new HttpService();
  const params: IParams = {
    x_cg_demo_api_key: COINGECO_KEY,
  };
  return from(http.get<any[]>(`${COINGECO_API}/exchanges`, params)).pipe(
    switchMap((exchanges) =>
      from(fetchCountryAll$()).pipe(
        map((countries) => {
          const data: IMarket[] =
            exchanges?.map((exchange, i) => {
              const match = countries?.find((item) => item.country === exchange.country) ?? null;
              return {
                id: i + 1,
                name: exchange?.name ?? null,
                country: exchange?.country ?? null,
                coordinates: match?.latlng ? [match.latlng[1], match.latlng[0], 2] : [0, 0, 2],
                lineColor: colors.blue,
                pointColor: colors.lightBlue,
                connections: [],
                countryCode: match?.cca2 ?? null,
                cca3: match?.cca3 ?? null,
                flag: match?.flag ?? null,
                flagSrc: match?.flags ?? null,
                description: exchange?.description ?? null,
                hasTradingIncentive: exchange?.has_trading_incentive ?? false,
                image: exchange?.image ?? null,
                tradeVolume24hBtc: exchange?.trade_volume_24h_btc ?? null,
                tradeVolume24hBtcNormalized: exchange?.trade_volume_24h_btc_normalized ?? null,
                trustScore: exchange?.trust_score ?? null,
                trustScoreRank: exchange?.trust_score_rank ?? null,
                url: exchange.url ?? null,
                yearEstablished: exchange?.year_established ?? null,
              };
            }) ?? [];

          const reduceDuplatedData = mergeDuplicateExchanges(data);

          const markets = (reduceDuplatedData?.map((item) => {
            const { coordinates } = item || {};
            const filteredData =
              reduceDuplatedData?.filter((el) => el?.coordinates?.[0] !== coordinates?.[0] && el?.coordinates?.[1] !== coordinates?.[1]) ??
              [];

            return {
              ...item,
              connections: filteredData?.map(({ name, coordinates }) => ({ name, coordinates })) ?? [],
            };
          }) ?? []) as IMarket[];

          return { markets, countries };
        })
      )
    ),
    catchError((error) => {
      console.error('Error fetching exchange data:', error);
      return throwError(() => error);
    })
  );
};
