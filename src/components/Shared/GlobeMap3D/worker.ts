import { convertLatLngToVector3 } from '@/shared/utils/convertLatLngToVector';
import { FeatureCollection, Geometry } from 'geojson';

self.onmessage = function (event) {
  try {
    const geoJson: FeatureCollection<Geometry> | null = event.data?.geoJson ?? null;
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
            return convertLatLngToVector3(lat, lng, 1.01);
          });

          if (!points[0].equals(points[points.length - 1])) {
            points.push(points[0]);
          }

          return points;
        }) ?? []
      );
    });

    // Send back raw border coordinates
    self.postMessage(borders);
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage(null);
  }
};
