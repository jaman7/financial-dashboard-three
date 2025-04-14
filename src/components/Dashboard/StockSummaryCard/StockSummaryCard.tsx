import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '@/shared/components/Card/Card';
import { fetchHistoricalStockData$, fetchStockSummaryData$ } from '@/services/stockService';
import Loader from '@/shared/components/Loader/Loader';
import { useStockStore } from '@/store/useStockStore';
import { findNameFromDict } from '@/shared/utils/helpers';
import MainLineChart from '@/components/Shared/MainLineChart';
import FiltersChartButtons from '@/components/Shared/FiltersChartButtons/FiltersChartButtons';
import { IButtonsTimeFrameType } from '@/components/Shared/FiltersChartButtons/FiltersChartButtons.types';
import SelectFilters from '@/components/Shared/SelectFilters';
import { useDictionaryStore } from '@/store/useDictionaryStore';
import './StockSummaryCard.scss';
import HighLowDeatils from './HighLowDeatils';
import SummaryDeatils from './SummaryDeatils';

const StockSummaryCard: React.FC = () => {
  const [filtersSelectedValues, setFiltersSelectedValues] = useState<Record<string, number>>({
    idStock: 1,
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<IButtonsTimeFrameType>('1D');
  const [selectedDateRange, setSelectedDateRange] = useState<number>(30);
  const [isLoadingRender, setIsLoadingRender] = useState(false);
  const isLoadingRef = useRef({ summary: false, historical: false });
  const stock = useStockStore((state) => state.stock);
  const historicalData = useStockStore((state) => state.historicalData);
  const dictionary = useDictionaryStore((state) => state.dictionary);
  const { updateStockData, updateStockHistoricalData } = useStockStore();

  const { stockDict = [] } = dictionary || {};

  const ticker = useMemo(() => findNameFromDict(filtersSelectedValues.idStock, stockDict ?? []) ?? null, [filtersSelectedValues.idStock]);

  const updateLoadingState = () => {
    const isAnyLoading = isLoadingRef.current.summary || isLoadingRef.current.historical;
    setIsLoadingRender(isAnyLoading);
  };

  useEffect(() => {
    if (!ticker || !selectedDateRange || !selectedTimeframe) return;

    isLoadingRef.current.summary = true;
    isLoadingRef.current.historical = true;
    updateLoadingState();

    const summary$ = fetchStockSummaryData$(ticker).subscribe((stockSummary) => {
      const name = stockDict.find((el) => el.symbol === ticker)?.name ?? '';
      updateStockData({ ...stockSummary, name });

      isLoadingRef.current.summary = false;
      updateLoadingState();
    });

    const historical$ = fetchHistoricalStockData$(ticker, selectedDateRange, selectedTimeframe).subscribe((historicalStock) => {
      updateStockHistoricalData(historicalStock);

      isLoadingRef.current.historical = false;
      updateLoadingState();
    });

    return () => {
      summary$.unsubscribe();
      historical$.unsubscribe();
    };
  }, [filtersSelectedValues.idStock]);

  useEffect(() => {
    if (!ticker || !selectedDateRange || !selectedTimeframe) return;

    isLoadingRef.current.historical = true;
    updateLoadingState();

    const subscription = fetchHistoricalStockData$(ticker, selectedDateRange, selectedTimeframe).subscribe((historicalStock) => {
      updateStockHistoricalData(historicalStock);
      isLoadingRef.current.historical = false;
      updateLoadingState();
    });

    return () => subscription.unsubscribe();
  }, [selectedTimeframe, selectedDateRange]);

  const handleTimeframeChange = (timeframe: IButtonsTimeFrameType) => {
    setSelectedTimeframe(timeframe);
  };

  const handleDateRangeChange = (dateRange: number) => {
    setSelectedDateRange(dateRange);
  };

  const handleSelectChange = (newValues: Record<string, number>) => {
    setFiltersSelectedValues(newValues);
  };

  return (
    <Card header="Stock summary actives">
      <div className="stock-summary-card">
        <div className="summary-container">
          <div className="left-section">
            <SummaryDeatils data={stock} isLoading={isLoadingRender} type="head" />

            <SelectFilters
              options={[{ key: 'idStock', dictData: stockDict, defaultValue: 2 }]}
              selectedValues={filtersSelectedValues}
              onChange={handleSelectChange}
            />

            <SummaryDeatils data={stock} isLoading={isLoadingRender} type="vol" />
          </div>

          <div className="right-section">
            <HighLowDeatils data={stock} isLoading={isLoadingRender} />
          </div>
        </div>

        <div className="bar-chart-container">
          {!isLoadingRender ? (
            <>
              <MainLineChart chartData={historicalData} dataKeyX="name" dataKeyY="volume" height={260} />
              <FiltersChartButtons
                selectedTimeframe={selectedTimeframe}
                selectedDateRange={selectedDateRange}
                onTimeframeChange={handleTimeframeChange}
                onDateRangeChange={handleDateRangeChange}
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

export default StockSummaryCard;
