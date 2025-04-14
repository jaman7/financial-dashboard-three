import { IButtonsTimeFrameType } from './FiltersChartButtons.types';

export const timeframes: { label: string; value: IButtonsTimeFrameType }[] = [
  { label: '1H', value: '1H' },
  { label: '6H', value: '6H' },
  { label: '12H', value: '12H' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
];

export const dateRanges = [
  { label: '7D', value: 7 },
  { label: '1M', value: 30 },
  { label: '3M', value: 90 },
  { label: '6M', value: 180 },
  { label: '1Y', value: 365 },
  { label: '5Y', value: 1825 },
  { label: '10Y', value: 3650 },
];
