import { FeatureCollection, Geometry } from 'geojson';
import { create } from 'zustand';

type GeoJsonState = {
  geoJson?: FeatureCollection<Geometry> | null;
  updateCountriesGeoJson: (data: FeatureCollection<Geometry>) => void;
};

export const useGeoJsonStore = create<GeoJsonState>((set) => ({
  geoJson: null,
  updateCountriesGeoJson: (data) => set({ geoJson: data }),
}));
