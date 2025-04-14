import { ITableColumns } from '@/shared/components/table/table.model';
import { ICurrencyTableRow, ICurrencyVolumeData } from '../Models/currency';

export const transformDataForTable = <T extends { date: string; volume: ICurrencyVolumeData }>(
  data: T[],
  keys?: string[]
): { columnConfig: { [key: string]: ITableColumns }; tableData: ICurrencyTableRow[] } => {
  if (!data || data.length === 0) return { columnConfig: {}, tableData: [] };

  let columnConfig: { [key: string]: ITableColumns } = {
    date: { type: 'DateTime' },
  };

  const tableData =
    data?.map((entry, i) => {
      const transformedEntry: ICurrencyTableRow = { id: i + 1, date: entry.date };

      Object.keys(entry.volume)?.forEach((currency) => {
        const columnKey = currency.toLowerCase();
        transformedEntry[columnKey] = entry.volume[currency];
        if (keys && keys.indexOf(currency) > -1) {
          columnConfig[columnKey] = { customHeader: currency } as ITableColumns;
        }
      });

      return transformedEntry;
    }) ?? [];

  if (keys) {
    columnConfig = {
      date: columnConfig.date,
      ...Object.fromEntries(
        keys
          ?.map((key) => key.toLowerCase())
          ?.filter((key) => columnConfig[key])
          ?.map((key) => [key, columnConfig[key]])
      ),
    };
  }

  return { columnConfig, tableData };
};

const getCurrencyPrecision = (currency: string): number => {
  const currencyPrecisionMap: Record<string, number> = {
    JPY: 0,
    KRW: 0,
    IDR: 0,
    HUF: 0,
  };

  return currencyPrecisionMap[currency] ?? 2;
};

export const convertCurrency = (data: ICurrencyTableRow, ids: string[], amount: number): ICurrencyTableRow => {
  if (!data || ids.length === 0) return { ...data };

  return ids.reduce(
    (acc, currency) => {
      const currencyKey = currency.toLowerCase();
      if (currencyKey in data) {
        acc[currencyKey] = parseFloat(((data[currencyKey] as number) * amount).toFixed(getCurrencyPrecision(currency.toUpperCase())));
      }
      return acc;
    },
    { id: data.id, date: data.date } as ICurrencyTableRow
  );
};
