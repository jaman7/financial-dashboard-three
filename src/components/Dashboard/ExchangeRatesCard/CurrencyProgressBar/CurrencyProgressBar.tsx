import { FC, useMemo } from 'react';
import { chartStyle } from '@/data/data';
import ProgressBar from '@/shared/components/ProgressBar/ProgressBar';
import { ICurrencyTableRow } from '@/components/Models/currency';
import './CurrencyProgressBar.scss';

interface CurrencyProgressBarProps {
  data: ICurrencyTableRow[];
  currencyIds: string[];
  colors?: string[];
}

const CurrencyProgressBar: FC<CurrencyProgressBarProps> = ({ data = [], currencyIds = [], colors = chartStyle.colors }) => {
  if (!data || data?.length === 0 || currencyIds?.length < 2) return null;

  const baseCurrency = currencyIds?.[0].toLowerCase();
  const targetCurrencies = currencyIds?.slice(1, 4)?.map((c) => c.toLowerCase()) ?? [];

  const progressData = useMemo(() => {
    const latestData = data?.[data.length - 1] ?? [];
    const baseValue = latestData?.[baseCurrency] || 1;

    return (
      targetCurrencies?.map((currency, index) => ({
        id: index + 1,
        label: `${baseCurrency.toUpperCase()} / ${currency.toUpperCase()}`,
        value: typeof latestData?.[currency] === 'number' && typeof baseValue === 'number' ? (latestData[currency] / baseValue) * 100 : 0,
        color: colors?.slice(1)?.[index % colors.length],
      })) ?? []
    );
  }, [data, currencyIds, colors]);

  return (
    <div className="currency-progress-container">
      {progressData?.map(({ label, value, color, id }) => (
        <ProgressBar key={`currencyProgressBar-${label}-${id}`} label={label ?? 'N/A'} value={value ?? 0} color={color ?? colors[0]} />
      ))}
    </div>
  );
};

export default CurrencyProgressBar;
