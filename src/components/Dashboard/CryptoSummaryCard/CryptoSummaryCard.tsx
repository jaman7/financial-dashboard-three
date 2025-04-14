import React, { useCallback, useEffect, useRef, useState } from 'react';
import Card from '@/shared/components/Card/Card';
import { fetchCryptoHistoryData$, fetchCryptoSummaryData$ } from '@/services/cryptoService';
import { catchError, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { useCryptoStore } from '@/store/useCryptoStore';
import Loader from '@/shared/components/Loader/Loader';
import { findDataDict, findNameFromDict } from '@/shared/utils/helpers';
import MainLineChart from '@/components/Shared/MainLineChart';
import FiltersChartButtons from '@/components/Shared/FiltersChartButtons/FiltersChartButtons';
import SelectFilters from '@/components/Shared/SelectFilters';
import CryptoDetails from './CryptoDetails';
import { useDictionaryStore } from '@/store/useDictionaryStore';
import './CryptoSummaryCard.scss';

const CryptoSummaryCard: React.FC = () => {
  const [filtersSelectedValues, setFiltersSelectedValues] = useState<Record<string, number>>({
    idCoin: 13,
    currencyId: 1,
  });
  const [selectedDateRange, setSelectedDateRange] = useState<number>(30);
  const firstRender = useRef(true);

  const cryptoData = useCryptoStore((state) => state.cryptoData);
  const historyData = useCryptoStore((state) => state.cryptoHistory);
  const dictionary = useDictionaryStore((state) => state.dictionary);
  const { updateCryptoData, updateCryptoHistoryData } = useCryptoStore();
  const { currencyDict = [], cryptoDict = [] } = dictionary || {};

  const defaultCurrencyId = currencyDict?.[0]?.id ?? 1;

  const getCurrencyName = (): string => {
    const { currencyId } = filtersSelectedValues || {};
    return currencyDict?.find((el) => el.id === currencyId)?.displayName?.toLowerCase() ?? 'usd';
  };

  useEffect(() => {
    const { idCoin, currencyId } = filtersSelectedValues || {};
    if (!idCoin || !currencyId || !cryptoDict.length) return;

    const coinName = findDataDict(idCoin, cryptoDict)?.dataId;
    const currencyName = findNameFromDict(currencyId, [...currencyDict]);

    if (!coinName || !currencyName) return;

    const subscription = fetchCryptoSummaryData$(coinName)
      .pipe(
        tap((data) => {
          if (!data) return;
          updateCryptoData(data);
        }),
        switchMap(() => fetchCryptoHistoryData$(coinName, currencyName, selectedDateRange)),
        tap((data) => {
          if (!data) return;
          updateCryptoHistoryData(data);
        }),
        catchError((error) => {
          console.warn('Error fetching crypto data:', error);
          return of(null);
        }),
        distinctUntilChanged()
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [filtersSelectedValues.idCoin, filtersSelectedValues.currencyId, cryptoDict]);

  useEffect(() => {
    const { idCoin, currencyId } = filtersSelectedValues || {};
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!idCoin || !currencyId) return;

    const coinName = findDataDict(idCoin, cryptoDict)?.dataId;
    const currencyName = findNameFromDict(currencyId, [...currencyDict]);

    if (!coinName || !currencyName) return;

    const subscription = fetchCryptoHistoryData$(coinName, currencyName, selectedDateRange)
      .pipe(
        tap((data) => {
          if (!data) return;
          updateCryptoHistoryData(data);
        }),
        catchError((error) => {
          console.warn('Error fetching crypto history data:', error);
          return of(null);
        }),
        distinctUntilChanged()
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [selectedDateRange]);

  const handleDateRangeChange = useCallback((dateRange: number) => {
    setSelectedDateRange(dateRange);
  }, []);

  const handleSelectChange = (newValues: Record<string, number>) => {
    setFiltersSelectedValues(newValues);
  };

  return (
    <Card header="Crypto Summary">
      <div className="crypto-summary-card">
        <div className="crypto-summary-select">
          {currencyDict?.length ? (
            <SelectFilters
              options={[
                { key: 'idCoin', dictData: cryptoDict, defaultValue: 13 },
                { key: 'currencyId', dictData: [...currencyDict], defaultValue: defaultCurrencyId as number },
              ]}
              selectedValues={filtersSelectedValues}
              onChange={handleSelectChange}
            />
          ) : (
            <Loader />
          )}
        </div>

        <CryptoDetails data={cryptoData} currencyName={getCurrencyName()} />

        <div className="bar-chart-container">
          {historyData?.length ? (
            <>
              <MainLineChart chartData={historyData} dataKeyX="date" dataKeyY="price" height={165} />
              <FiltersChartButtons
                selectedDateRange={selectedDateRange}
                onDateRangeChange={handleDateRangeChange}
                isTimeframe={false}
                allowedDateRanges={[7, 30, 90, 180, 365]}
              />
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </Card>
  );
};

export default CryptoSummaryCard;
