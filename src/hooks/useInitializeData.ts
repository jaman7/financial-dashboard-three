import { currencyDict as currencyDictionary } from '@/data/data';
import { fetchCountriesGeoJson$ } from '@/services/countriesGeoJson';
import { fetchCryptoCoinListData$, fetchCryptoHistoryData$, fetchCryptoSummaryData$ } from '@/services/cryptoService';
import { fetchExchangeRatesData$ } from '@/services/exchangeService';
import { fetchExchangeData$ } from '@/services/marketService';
import { fetchHistoricalStockData$, fetchStockListData$, fetchStockSummaryData$ } from '@/services/stockService';
import { findNameFromDict } from '@/shared/utils/helpers';
import { useCryptoStore } from '@/store/useCryptoStore';
import { useDictionaryStore } from '@/store/useDictionaryStore';
import { useExchangeStore } from '@/store/useExchangeStore';
import { useGeoJsonStore } from '@/store/useGeoJsonStore';
import { useMarketStore } from '@/store/useMarketStore';
import { useStockStore } from '@/store/useStockStore';
import { ICountryDict, ICryptoDict, ICurrencyDict, IStockDict } from '@/types/dictionaryTypes';
import { IExchangeRate } from '@/types/exchangeTypes';
import { useEffect } from 'react';
import { combineLatest } from 'rxjs';

export const useInitializeData = () => {
  const dictionary = useDictionaryStore((state) => state.dictionary);
  const { updateMarkets } = useMarketStore();
  const { updateCountriesGeoJson } = useGeoJsonStore();
  const { updateCryptoData, updateCryptoHistoryData } = useCryptoStore();
  const { updateStockData, updateStockHistoricalData } = useStockStore();
  const { updateExchangeRate } = useExchangeStore();
  const { updateDictionary } = useDictionaryStore();
  const { cryptoDict = [], stockDict = [] } = dictionary || {};

  useEffect(() => {
    const subscription = combineLatest([
      fetchExchangeRatesData$('USD', 30),
      fetchExchangeData$(),
      fetchCountriesGeoJson$(),
      fetchCryptoCoinListData$(),
      fetchStockListData$(),
    ]).subscribe(([exchanges, countryMarketsData, geoJson, cryptoList, stockList]) => {
      const { markets = [], countries = [] } = countryMarketsData || {};

      const currencyDict =
        [...currencyDictionary]?.map((el) => {
          const country = countries?.find((item) => item.currencyName === el.displayName && item.flags === el.flags) ?? null;

          if (country) {
            const { id, displayName, ...rest } = country || {};

            return { ...el, ...rest };
          } else {
            return el;
          }
        }) ?? [];

      updateDictionary({
        currencyDict: currencyDict as ICurrencyDict[],
        countryDict: countries as ICountryDict[],
        cryptoDict: cryptoList as ICryptoDict[],
        stockDict: stockList as IStockDict[],
      });
      updateExchangeRate((exchanges ?? []) as IExchangeRate[]);
      updateMarkets(markets ?? []);
      updateCountriesGeoJson(geoJson);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const id = 'bitcoin';
    const ticker = findNameFromDict(1, stockDict ?? []);
    if (cryptoDict?.length && stockDict?.length && ticker) {
      const subscription = combineLatest([
        fetchCryptoSummaryData$(id),
        fetchCryptoHistoryData$(id, 'usd', 30),
        fetchStockSummaryData$(ticker),
        fetchHistoricalStockData$(ticker, 30, '1D'),
      ]).subscribe(([cryptoSummary, cryptoHistory, stock, historicalData]) => {
        const name = stockDict?.find((el) => el.symbol === stock.symbol)?.name ?? '';
        updateCryptoData(cryptoSummary);
        updateCryptoHistoryData(cryptoHistory);
        updateStockData({ ...stock, name });
        updateStockHistoricalData(historicalData);
      });

      return () => subscription.unsubscribe();
    }
  }, [cryptoDict, stockDict]);
};
