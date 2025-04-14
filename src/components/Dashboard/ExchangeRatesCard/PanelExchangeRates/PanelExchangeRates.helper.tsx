import { mathOperation } from '@/shared/utils/math-operaation';
import { TableRow } from '../ExchangeRatesCard.model';

export interface CurrencyIndicators {
  [key: string]: {
    min?: number;
    max?: number;
    avg?: string;
    lastChange?: string;
    avgDailyChange?: string;
  };
}

export const calculateCurrencyIndicators = (exchangeRates: TableRow[], currencyIds: string[]): CurrencyIndicators => {
  if (!exchangeRates || exchangeRates.length === 0) return {};

  return currencyIds?.reduce((acc, currency) => {
    const rates = (exchangeRates?.map((entry) => entry[currency.toLowerCase()])?.filter((rate) => rate !== undefined) ?? []) as number[];

    if (rates.length === 0) return acc;

    const min = Math.min(...rates).toFixed(2);
    const max = Math.max(...rates).toFixed(2);
    const avg = (rates?.reduce((sum, rate) => mathOperation(sum as number, rate as number), 0) / rates.length).toFixed(2);

    const dailyChanges =
      rates?.map((rate: number, index: number) =>
        ((mathOperation(rate as number, rates[index] as number, false) / rates[index]) * 100).toFixed(2)
      ) ?? [];

    const avgDailyChange = dailyChanges?.length
      ? (
          dailyChanges?.reduce((sum, change) => mathOperation(sum as number, parseFloat(change) as number), 0) / dailyChanges.length
        ).toFixed(2)
      : '0.00';

    const lastChange =
      rates.length > 1
        ? ((mathOperation(rates[rates.length - 1], rates[rates.length - 2] as number, false) / rates[rates.length - 2]) * 100).toFixed(2)
        : '0.00';

    acc[currency.toLowerCase()] = {
      min: parseFloat(min),
      max: parseFloat(max),
      avg,
      lastChange: `${lastChange}%`,
      avgDailyChange: `${avgDailyChange}%`,
    };

    return acc;
  }, {} as CurrencyIndicators);
};
