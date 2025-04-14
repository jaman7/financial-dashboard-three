import Card from '@/shared/components/Card/Card';
import { useEffect, useMemo, useState } from 'react';
import {
  fetchHistoricalBarsDataAlpaca$,
  fetchProfileDataFinhub$,
  fetchStocksBarDataAlpacaLatest$,
  fetchTopStocksTickers$,
} from '@/services/stockService';
import { catchError, distinctUntilChanged, forkJoin, from, map, of, switchMap } from 'rxjs';
import LazyImage from '@/shared/components/LazyImage/LazyImage';
import { IStockBarAlpaca, IStockHistoryBarsAlpaca, IStocksProfile, IStocksTickersAlpaca } from '@/types/stockTypes';
import { convertDataAlpacaApi, convertDataAlpacaHistoryApi, findDataDict } from '@/shared/utils/helpers';
import MainLineChart from '@/components/Shared/MainLineChart';
import Loader from '@/shared/components/Loader/Loader';
import { countMarketDict, marketMostTopDict } from './StocksMapCard.config';
import Divider from '@/shared/components/divider/Divider';
import { IButtonsTimeFrameType } from '@/components/Shared/FiltersChartButtons/FiltersChartButtons.types';
import FiltersChartButtons from '@/components/Shared/FiltersChartButtons/FiltersChartButtons';
import StocksCards from './StocksCards';
import SelectFilters from '@/components/Shared/SelectFilters';
import './StocksMapCard.scss';

const StocksMapCard: React.FC = () => {
  const [stocks, setStocks] = useState<IStocksTickersAlpaca[]>([]);
  const [historyStock, setHistoryStock] = useState<IStocksTickersAlpaca[]>([]);
  const [stockProfile, setStockProfile] = useState<IStocksProfile>({});
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<IButtonsTimeFrameType>('1D');
  const [selectedDateRange, setSelectedDateRange] = useState<number>(30);

  const [filtersSelectedValues, setFiltersSelectedValues] = useState<Record<string, number>>({
    countMarket: 1,
    marketMostTop: 1,
  });

  const memoizedHistoryStock = useMemo(() => historyStock ?? [], [historyStock]);

  const marketMostTopName = useMemo(
    () => findDataDict(filtersSelectedValues.marketMostTop, marketMostTopDict)?.displayName,
    [filtersSelectedValues.marketMostTop]
  );

  useEffect(() => {
    const { countMarket, marketMostTop } = filtersSelectedValues || {};
    const countMarketValue = findDataDict(countMarket, countMarketDict)?.value;
    const marketMostTopValue = findDataDict(marketMostTop, marketMostTopDict)?.value;
    if (countMarketValue && marketMostTopValue) {
      const subscription = fetchTopStocksTickers$(marketMostTopValue)
        .pipe(
          distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
          switchMap((topStocks) => {
            const limit = countMarketValue;
            const tickers = topStocks.slice(0, limit).map((stock) => stock.symbol);
            const params = {
              symbols: tickers,
            };
            return from(fetchStocksBarDataAlpacaLatest$(params)).pipe(
              catchError((error) => {
                console.error('Error fetching stock data:', error);
                return of(null);
              }),
              map((response) => ({ response, tickers }))
            );
          }),
          map(({ response, tickers }) => {
            return (
              tickers
                ?.map((symbol) => {
                  const data = response?.[symbol as string] as IStockBarAlpaca;
                  return convertDataAlpacaApi(data, symbol);
                })
                ?.filter(Boolean) ?? []
            );
          })
        )
        .subscribe((filteredData) => {
          setStocks((filteredData as IStocksTickersAlpaca[]) ?? []);
          if (filteredData.length) setSelectedTicker((filteredData?.[0]?.ticker as string) ?? null);
        });

      return () => subscription.unsubscribe();
    }
  }, [filtersSelectedValues.countMarket, filtersSelectedValues.marketMostTop]);

  useEffect(() => {
    if (!selectedTicker) return;
    const subscription = forkJoin({
      historicalData: fetchHistoricalBarsDataAlpaca$(selectedTicker as string, selectedTimeframe, selectedDateRange).pipe(
        catchError((error) => {
          console.error('Error fetching historical data:', error);
          return of([]);
        })
      ),
      profileData: fetchProfileDataFinhub$(selectedTicker).pipe(
        catchError((error) => {
          console.error('Error fetching profile data:', error);
          return of(null);
        })
      ),
    }).subscribe(({ historicalData, profileData }) => {
      setHistoryStock(convertDataAlpacaHistoryApi(historicalData as IStockHistoryBarsAlpaca, selectedTicker));
      setStockProfile(profileData ?? {});
    });
    return () => subscription.unsubscribe();
  }, [selectedTicker, selectedTimeframe, selectedDateRange]);

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
    <Card header="Stocks Map">
      <div className="stocks-map">
        <div className="stocks-chart">
          {memoizedHistoryStock?.length ? (
            <>
              <h2>
                {selectedTicker} - Historical Price - {marketMostTopName}
              </h2>

              <MainLineChart chartData={memoizedHistoryStock ?? []} dataKeyX="date" dataKeyY="price" height={130} />

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

        <Divider />
        <div className="stock-profile">
          <LazyImage src={stockProfile?.logo as string} alt={stockProfile?.name} className="stock-profile-img" />
          <div className="stock-profile-detail">
            <h3>{stockProfile?.name}</h3>
            <p>
              Exchange: <span>{stockProfile?.exchange}</span>
            </p>
            <p>
              finnhub industry: <span>{stockProfile?.finnhubIndustry}</span>
            </p>
          </div>
        </div>

        <Divider />

        <div className="stocks-cards">
          <div className="stocks-counts-filters">
            <p>Filters Stocks Most</p>

            <SelectFilters
              options={[
                { key: 'countMarket', dictData: countMarketDict, defaultValue: 1 },
                { key: 'marketMostTop', dictData: marketMostTopDict, defaultValue: 1 },
              ]}
              selectedValues={filtersSelectedValues}
              onChange={handleSelectChange}
            />
          </div>
          <div className="stocks-cards-grid">
            <StocksCards data={stocks ?? []} ticker={selectedTicker as string} setSelectedTicker={setSelectedTicker} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StocksMapCard;
