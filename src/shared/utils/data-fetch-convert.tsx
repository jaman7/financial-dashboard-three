import { timeframeMap, TimeFrameTypes } from '@/types/dictionaryTypes';

export function convertToCamelCase<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCase(item)) as T;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
      (acc as any)[camelKey] = convertToCamelCase((obj as any)[key]);
      return acc;
    }, {} as T);
  }
  return obj;
}

export const convertTimeframeToPolygoIo = (timeframe: TimeFrameTypes): string => {
  return timeframeMap?.[timeframe] ?? '1/day';
};
