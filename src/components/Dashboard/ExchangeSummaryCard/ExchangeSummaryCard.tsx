import { useEffect, useRef, useState } from 'react';
import { tap } from 'rxjs';
import Card from '@/shared/components/Card/Card';
import { fetchExchangeRatesData$ } from '@/services/exchangeService';
import { findNameFromDict } from '@/shared/utils/helpers';
import { useExchangeStore } from '@/store/useExchangeStore';
import MainLineChart from '@/components/Shared/MainLineChart';
import FiltersChartButtons from '@/components/Shared/FiltersChartButtons/FiltersChartButtons';
import Loader from '@/shared/components/Loader/Loader';
import Divider from '@/shared/components/divider/Divider';
import { IExchangeRate } from '@/types/exchangeTypes';
import Table from '@/shared/components/table/table';
import { ITableColumns } from '@/shared/components/table/table.model';
import { createTableColumnsConfig } from '@/shared/utils/table-utils';
import SelectFilters from '@/components/Shared/SelectFilters';
import { useDictionaryStore } from '@/store/useDictionaryStore';
import { transformDataForTable } from '@/components/Helpers/convertCurrency';
import { ICurrencyTableRow } from '@/components/Models/currency';
import './ExchangeSummaryCard.scss';

const ExchangeSummaryCard: React.FC = () => {
  const [exchangeToData, setExchangeToData] = useState<{ date: string; volume: number }[]>([]);
  const [percentageChange, setPercentageChange] = useState(0);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [filtersSelectedValues, setFiltersSelectedValues] = useState<Record<string, number>>({
    currencyFromId: 1,
    currencyToId: 3,
  });

  const [selectedDateRange, setSelectedDateRange] = useState<number>(30);
  const [tableColumns, setTableColumns] = useState<ITableColumns[]>([]);
  const [tableData, setTableData] = useState<ICurrencyTableRow[]>([]);
  const hasProcessedExchangeRate = useRef(false);
  const isFirstFetch = useRef(true);
  const dictionary = useDictionaryStore((state) => state.dictionary);
  const { updateExchangeRate } = useExchangeStore();
  const exchangeRate = useExchangeStore((state) => state.exchangeRate);

  const { currencyDict = [] } = dictionary || {};
  const currencyFrom = findNameFromDict(filtersSelectedValues?.currencyFromId, currencyDict);
  const currencyTo = findNameFromDict(filtersSelectedValues?.currencyToId, currencyDict);

  const setData = (rates: IExchangeRate[], to: string): void => {
    if (!rates || rates.length === 0) return;

    const volumes = rates.map((r) => r.volume?.[to]).filter((v) => v !== undefined);
    if (volumes.length === 0) return;

    const first = volumes[0];
    const last = volumes[volumes.length - 1];

    setMinValue(Math.min(...volumes));
    setMaxValue(Math.max(...volumes));
    setPercentageChange(((last - first) / first) * 100);
    setExchangeToData(rates.map((el) => ({ ...el, volume: el.volume?.[to] })));
  };

  useEffect(() => {
    if (isFirstFetch.current) {
      isFirstFetch.current = false;
      return;
    }

    const from = currencyFrom;
    const to = currencyTo;
    if (!from || !to) return;
    const subscription = fetchExchangeRatesData$(from, selectedDateRange)
      .pipe(
        tap((rates) => {
          if (rates?.length) {
            updateExchangeRate(rates ?? []);
            setData(rates ?? [], to);
          }
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [filtersSelectedValues.currencyFromId, selectedDateRange]);

  useEffect(() => {
    if (!exchangeRate || !currencyTo) return;
    setData(exchangeRate, currencyTo);
    const { columnConfig, tableData } = transformDataForTable(exchangeRate, [currencyTo]);
    setTableColumns(
      createTableColumnsConfig(columnConfig, {
        prefix: 'exchangeSummaryCard.table',
      })
    );
    setTableData(tableData);
    hasProcessedExchangeRate.current = true;
  }, [filtersSelectedValues.currencyToId, exchangeRate]);

  const handleDateRangeChange = (dateRange: number) => {
    setSelectedDateRange(dateRange);
  };

  const handleSelectChange = (newValues: Record<string, number>) => {
    setFiltersSelectedValues(newValues);
  };

  return (
    <Card header="Exchange Summary">
      <div className="exchange-summary-card">
        <div className="bar-chart-container">
          {exchangeToData?.length ? (
            <>
              <MainLineChart chartData={exchangeToData} dataKeyX="date" dataKeyY="volume" height={150} />
              <FiltersChartButtons selectedDateRange={selectedDateRange} onDateRangeChange={handleDateRangeChange} isTimeframe={false} />
            </>
          ) : (
            <Loader />
          )}
        </div>

        <Divider />

        <div className="exchange-select-container">
          <SelectFilters
            options={[
              { key: 'currencyFromId', dictData: currencyDict, defaultValue: 1 },
              {
                key: 'currencyToId',
                dictData: currencyDict?.filter((el) => el.id !== filtersSelectedValues?.currencyFromId),
                defaultValue: 3,
              },
            ]}
            selectedValues={filtersSelectedValues}
            onChange={handleSelectChange}
          />
        </div>

        <div className="exchange-summary-info">
          <div className="left">
            <p className="value big">{percentageChange?.toFixed(2)}%</p>
          </div>
          <div className="right">
            <p className="small">
              {minValue?.toLocaleString()} / {maxValue?.toLocaleString()} {currencyTo}
            </p>
          </div>
        </div>
        {tableData?.length ? (
          <Table
            columns={tableColumns ?? []}
            totalRecords={tableData?.length ?? 0}
            value={tableData ?? []}
            allowFilters={true}
            quantity={5}
            range={[5, 50, 5]}
            isSizeXs={true}
            isTransparency={true}
          />
        ) : (
          <Loader />
        )}
      </div>
    </Card>
  );
};

export default ExchangeSummaryCard;
