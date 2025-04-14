import { IMarket } from '@/types/marketTypes';
import { Vector3 } from 'three';

export const convertLatLngToVector3 = (lat: number, lng: number, radius = 1) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
};

export const mergeDuplicateExchanges = (data: IMarket[]): IMarket[] => {
  const map = new Map<string, IMarket>();

  data?.forEach((market) => {
    if (!market.coordinates) return;

    const key = `${market?.coordinates?.[0]}_${market?.coordinates?.[1]}`;
    const existing = map.get(key);

    if (existing) {
      const mergedNames = Array.isArray(existing.name) ? existing.name : [existing.name ?? ''];
      const newNames = Array.isArray(market.name) ? market.name : [market.name ?? ''];
      existing.name = [...new Set([...mergedNames, ...newNames])];
    } else {
      map.set(key, { ...market, name: Array.isArray(market.name) ? market.name : [market.name ?? ''] });
    }
  });

  return Array.from(map.values());
};
