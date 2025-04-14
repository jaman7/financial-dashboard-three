import { IDictType } from '@/shared/components/select/Select.model';

export const stockSectorsDict: IDictType[] = [
  { id: 1, displayName: 'Technology' },
  { id: 2, displayName: 'Healthcare' },
  { id: 3, displayName: 'Financials' },
  { id: 4, displayName: 'Energy' },
  { id: 5, displayName: 'Consumer Discretionary' },
  { id: 6, displayName: 'Industrials' },
  { id: 7, displayName: 'Materials' },
  { id: 8, displayName: 'Utilities' },
  { id: 9, displayName: 'Real Estate' },
  { id: 10, displayName: 'Communication Services' },
];

// 🔹 Lista rynków giełdowych (Statyczna)
export const stockMarketsDict: IDictType[] = [
  { id: 1, displayName: 'NASDAQ' },
  { id: 2, displayName: 'NYSE' },
  { id: 3, displayName: 'Euronext' },
  { id: 4, displayName: 'Tokyo Stock Exchange' },
  { id: 5, displayName: 'Shanghai Stock Exchange' },
  { id: 6, displayName: 'London Stock Exchange' },
  { id: 7, displayName: 'Hong Kong Stock Exchange' },
];

// 🔹 Domyślna lista spółek (tylko dla widoku demo)
export const stockMarketDict: IDictType[] = [
  { id: 1, displayName: 'AAPL', sectorId: 1, marketId: 1 },
  { id: 2, displayName: 'GOOGL', sectorId: 1, marketId: 1 },
  { id: 3, displayName: 'MSFT', sectorId: 1, marketId: 1 },
  { id: 4, displayName: 'AMZN', sectorId: 5, marketId: 1 },
  { id: 5, displayName: 'TSLA', sectorId: 6, marketId: 1 },
  { id: 6, displayName: 'JNJ', sectorId: 2, marketId: 2 },
  { id: 7, displayName: 'JPM', sectorId: 3, marketId: 2 },
  { id: 8, displayName: 'XOM', sectorId: 4, marketId: 2 },
  { id: 9, displayName: 'NVDA', sectorId: 1, marketId: 1 },
  { id: 10, displayName: 'BABA', sectorId: 5, marketId: 5 },
];

export const historicalCurrencyData = {
  EUR: [
    { date: '2024-02-01', open: 1.08, high: 1.1, low: 1.07, close: 1.09 },
    { date: '2024-02-02', open: 1.09, high: 1.11, low: 1.08, close: 1.1 },
    { date: '2024-02-03', open: 1.1, high: 1.12, low: 1.09, close: 1.11 },
    // ... więcej danych do 30 dni
  ],
  PLN: [
    { date: '2024-02-01', open: 4.3, high: 4.35, low: 4.28, close: 4.33 },
    { date: '2024-02-02', open: 4.33, high: 4.37, low: 4.3, close: 4.35 },
    { date: '2024-02-03', open: 4.35, high: 4.4, low: 4.33, close: 4.38 },
    // ... więcej danych do 30 dni
  ],
  JPY: [
    { date: '2024-02-01', open: 130.5, high: 132.0, low: 129.8, close: 131.2 },
    { date: '2024-02-02', open: 131.2, high: 133.0, low: 130.0, close: 132.4 },
    { date: '2024-02-03', open: 132.4, high: 134.5, low: 131.8, close: 133.7 },
    // ... więcej danych do 30 dni
  ],
};
