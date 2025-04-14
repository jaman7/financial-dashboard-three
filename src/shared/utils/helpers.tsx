import { IStockBarAlpaca, IStockBarsAlpaca, IStockHistoryBarsAlpaca, IStocksTickersAlpaca } from '@/types/stockTypes';
import { format, parseISO } from 'date-fns';
import { IDictType } from '../components/select/Select.model';
import { DATE_TIME_FORMAT } from '../enums';

export enum RgbFnStrings {
  PRE_DATA_RGBA = 'rgba',
  ALPHA_MSG_ERR = 'alpha is not correct!',
}

export const getChangedValues = <T extends Record<string, any>>(values: T, initialValues: T) => {
  return Object.entries(values).reduce((acc: Partial<T>, [key, value]) => {
    const hasChanged = initialValues[key as keyof T] !== value;
    if (hasChanged) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {});
};

export const toCamelCase = (text: string): string => {
  const tmpText = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  return tmpText.substring(0, 1).toLowerCase() + tmpText.substring(1);
};

export const arrayMove = (arr: any[], oldIndex: number, newIndex: number): any[] => {
  if (newIndex >= arr?.length) {
    var k = newIndex - arr?.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr?.splice(newIndex, 0, arr?.splice(oldIndex, 1)[0]);
  return arr;
};

export function hex2rgba(hex: string, alpha = 1): string {
  const tmpHex = hex.toLowerCase();
  const { PRE_DATA_RGBA, ALPHA_MSG_ERR } = RgbFnStrings;

  if (alpha > 1 || alpha < 0) {
    throw new Error(ALPHA_MSG_ERR);
  }
  const red = parseInt(tmpHex?.slice(1, 3), 16);
  const green = parseInt(tmpHex?.slice(3, 5), 16);
  const blue = parseInt(tmpHex?.slice(5, 7), 16);

  return `${PRE_DATA_RGBA}(${red},${green},${blue},${alpha})`;
}

export const findNameFromDict = (id: number | null, dict: IDictType[]): string => {
  return id ? (dict?.find((el) => el.id === (id as number))?.displayName ?? '') : '';
};

export const findDataDict = (id: number | null, dict: IDictType[]): IDictType => {
  return id ? (dict?.find((el) => el.id === (id as number)) ?? {}) : {};
};

export const convertDataAlpacaApi = (data: IStockBarAlpaca, symbol: string): IStocksTickersAlpaca | null => {
  return data
    ? {
        ticker: symbol,
        price: data.c,
        high: data.h,
        low: data.l,
        volume: data.v,
        timestamp: data.t,
        logo: `https://logo.clearbit.com/${symbol.toLowerCase()}.com`,
        // logo: `https://assets.parqet.com/logos/symbol/${symbol}?format=jpg&size=300`,
      }
    : null;
};

export const convertDataAlpacaHistoryApi = (data: IStockHistoryBarsAlpaca, symbol: string): IStocksTickersAlpaca[] => {
  const resData = data?.[symbol]?.map((el) => {
    return {
      ticker: symbol,
      price: el.c,
      high: el.h,
      low: el.l,
      volume: el.v,
      timestamp: el.t,
      logo: `https://logo.clearbit.com/${symbol.toLowerCase()}.com`,
      date: format(parseISO(el.t as string), DATE_TIME_FORMAT.FNS_DATE_TIME_NO_SEC),
    };
  });
  return resData ?? [];
};
