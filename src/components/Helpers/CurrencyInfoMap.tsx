import { ICurrencyDict } from '@/types/dictionaryTypes';

export const getCurrencyInfoMap = (
  currencyDict: ICurrencyDict[],
  currencyIds: string[]
): Record<string, { displayName: string; symbol: string; flags: string | null }> => {
  const valueFieldMap: Record<string, number> = {
    baseValue: 0,
    value1: 1,
    value2: 2,
    value3: 3,
  };

  const result: Record<string, { displayName: string; symbol: string; flags: string | null }> = {};

  if (!currencyDict?.length || !currencyIds?.length) return result;

  Object.entries(valueFieldMap)?.forEach(([key, index]) => {
    const currencyCode = currencyIds[index];
    const found = currencyDict?.find((el) => el.displayName?.toUpperCase() === currencyCode?.toUpperCase());
    if (found) {
      result[key] = {
        displayName: found.displayName ?? '',
        symbol: found.symbol ?? '',
        flags: found.flags ?? null,
      };
    }
  });

  return result;
};
