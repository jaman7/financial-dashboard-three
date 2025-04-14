import { FeatureCollection, Geometry } from 'geojson';
import { latLonToPosition } from './PanelMapBase.helper';

self.onmessage = function (event) {
  try {
    const geoJson: FeatureCollection<Geometry> | null = event.data?.geoJson ?? null;

    const width = event.data?.width;
    const height = event.data?.height;
    if (!geoJson) {
      self.postMessage(null);
      return;
    }

    const borders = geoJson?.features?.flatMap((feature: any) => {
      if (!feature?.geometry || (feature?.geometry?.type !== 'Polygon' && feature?.geometry?.type !== 'MultiPolygon')) return null;

      const polygons = feature?.geometry?.type === 'Polygon' ? [feature?.geometry?.coordinates] : feature?.geometry?.coordinates;

      return (
        polygons?.map((polygon: number[][][]) => {
          const points = polygon[0].map(([lng, lat]) => {
            return latLonToPosition(lat, lng, width, height);
          });

          if (!points[0].equals(points[points.length - 1])) {
            points.push(points[0]);
          }

          return points;
        }) ?? []
      );
    });

    self.postMessage(borders);
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage(null);
  }
};
