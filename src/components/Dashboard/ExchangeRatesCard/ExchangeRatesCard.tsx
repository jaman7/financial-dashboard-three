import React, { useEffect, useRef, useState } from 'react';
import Card from '@/shared/components/Card/Card';
// import { useTranslation } from 'react-i18next';
import { fetchExchangeRatesData$ } from '@/services/exchangeService';
import MainLineChart from '@/components/Shared/MainLineChart';
import { IExchangeRate } from '@/types/exchangeTypes';
import Table from '@/shared/components/table/table';
import Loader from '@/shared/components/Loader/Loader';
import { ITableColumns } from '@/shared/components/table/table.model';
import { tap } from 'rxjs';
import { createTableColumnsConfig } from '@/shared/utils/table-utils';
import { useExchangeRatesStore } from './store/useStore';
import PanelExchangeRates from './PanelExchangeRates/PanelExchangeRates';
import CandlestickChart from '@/components/Shared/CandlestickChart/CandlestickChart';
import PanelPieChart from './PanelPieChart/PanelPieChart';
import CurrencyProgressBar from './CurrencyProgressBar/CurrencyProgressBar';
// import PanelGlobeMap from './PanelGlobeMap/PanelMap';
import { ICurrencyTableRow } from '@/components/Models/currency';
import { transformDataForTable } from '@/components/Helpers/convertCurrency';
import { useDictionaryStore } from '@/store/useDictionaryStore';
import PanelControlsBase from '@/components/Shared/PanelControlsBase/PanelControlsBase';
import './ExchangeRatesCard.scss';
import PanelMapBase from '@/components/Shared/PanelMapBase/PanelMapBase';
import { useGeoJsonStore } from '@/store/useGeoJsonStore';

const ExchangeRatesCard: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<IExchangeRate[] | null>(null);
  const [tableColumns, setTableColumns] = useState<ITableColumns[]>([]);
  const [tableData, setTableData] = useState<ICurrencyTableRow[]>([]);
  const hasProcessedExchangeRate = useRef(false);
  const formValues = useExchangeRatesStore((state) => state.formValues);
  const currencyIds = useExchangeRatesStore((state) => state?.currencyIds ?? []);
  const dictionary = useDictionaryStore((state) => state.dictionary ?? {});
  const geoJson = useGeoJsonStore((state) => state.geoJson);
  const { updateFormValues, updateCurrencyIds } = useExchangeRatesStore();

  const { currencyDict = [] } = dictionary || {};

  // const { t } = useTranslation('dashboard');

  useEffect(() => {
    const [from, to1, to2, to3] = currencyIds || [];
    if (!from || !to1 || !to2 || !to3) return;
    const subscription = fetchExchangeRatesData$(from, formValues?.dateRange as number)
      .pipe(
        tap((rates) => {
          if (rates?.length) {
            setExchangeRates(rates);
          }
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [JSON.stringify(currencyIds), formValues.currencyFromId, formValues.dateRange]);

  useEffect(() => {
    const [from, to1, to2, to3] = currencyIds || [];
    if (!from || !to1 || !to2 || !to3) return;
    const { columnConfig, tableData } = transformDataForTable(exchangeRates ?? [], [to1, to2, to3]) || {};
    setTableColumns(
      createTableColumnsConfig(columnConfig, {
        prefix: 'exchangeRatesCard.table',
      })
    );
    setTableData(tableData);
    hasProcessedExchangeRate.current = true;
  }, [exchangeRates, formValues.currencyFromId, formValues.currencyToId1, formValues.currencyToId2, formValues.currencyToId3]);

  return (
    <Card header="Exchange Rates">
      <div className="exchange-rates-card">
        <div className="exchange-rates-card__item chart1">
          <CandlestickChart currencyIds={currencyIds.slice(1)} data={tableData ?? []} height={130} />
        </div>

        <div className="exchange-rates-card__item panel1">
          <PanelControlsBase
            data={tableData?.[tableData.length - 1]}
            formValues={formValues}
            currencyIds={currencyIds}
            dictionary={dictionary ?? {}}
            showFiltersChartButtons={true}
            formPrefix="exchangeRatesCard.currencyPanel"
            cardWrapper={false}
            scssModifier="-min"
            updateFormValues={updateFormValues}
            updateCurrencyIds={updateCurrencyIds}
          />
        </div>

        <div className="exchange-rates-card__item chart2">
          <MainLineChart chartData={tableData ?? []} dataKeyX="date" dataKeyY={currencyIds.slice(1)} height={130} />
        </div>

        <div className="exchange-rates-card__item panel2">
          <PanelExchangeRates data={tableData} />
        </div>

        <div className="exchange-rates-card__item map">
          <PanelMapBase geoJson={geoJson ?? null} dict={currencyDict ?? []} ids={currencyIds} />
        </div>

        <div className="exchange-rates-card__item pie">
          <PanelPieChart currencyIds={currencyIds.slice(1)} data={tableData ?? []} />
        </div>

        <div className="exchange-rates-card__item table">
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

        <div className="exchange-rates-card__item progress-bar">
          <CurrencyProgressBar currencyIds={currencyIds} data={tableData ?? []} />
        </div>
      </div>
    </Card>
  );
};

export default ExchangeRatesCard;
