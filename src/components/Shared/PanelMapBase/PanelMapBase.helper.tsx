import { FeatureCollection, Geometry } from 'geojson';
import proj4 from 'proj4';
import { BufferGeometry, Color, Line, LineBasicMaterial, Vector3 } from 'three';
import { colors } from '@/data/data';

export const latLonToPosition = (lat: number, lon: number, width: number, height: number) => {
  const projSource = '+proj=longlat +datum=WGS84 +no_defs';
  const projTarget = '+proj=eqc +datum=WGS84 +units=m +no_defs';
  const [x, y] = proj4(projSource, projTarget, [lon, lat]);

  if (isNaN(x) || isNaN(y)) {
    return new Vector3(0, 0, 0.3);
  }

  const xMin = proj4(projSource, projTarget, [-180, 0])[0];
  const xMax = proj4(projSource, projTarget, [180, 0])[0];
  const yMin = proj4(projSource, projTarget, [0, -90])[1];
  const yMax = proj4(projSource, projTarget, [0, 90])[1];
  const xScaled = ((x - xMin) / (xMax - xMin)) * width - width / 2;
  const yScaled = ((y - yMin) / (yMax - yMin)) * height - height / 2;

  return new Vector3(xScaled, -yScaled, 0.3);
};

export const generateCountryBorders = (
  geoJson: FeatureCollection<Geometry> | null,
  width: number,
  height: number
): React.JSX.Element[] | null => {
  if (!geoJson) return null;

  return geoJson?.features?.flatMap((feature: any, index: number) => {
    if (!feature?.geometry || (feature?.geometry?.type !== 'Polygon' && feature?.geometry?.type !== 'MultiPolygon')) return null;

    const polygons = feature?.geometry?.type === 'Polygon' ? [feature?.geometry?.coordinates] : feature?.geometry?.coordinates;

    return (
      polygons?.map((polygon: number[][][], polygonIndex: number) => {
        const points = polygon[0].map(([lng, lat]) => {
          return latLonToPosition(lat, lng, width, height);
        });

        if (!points[0].equals(points[points.length - 1])) {
          points.push(points[0]);
        }

        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({ color: new Color(colors?.lightGreen), linewidth: 2, linecap: 'round', linejoin: 'round' });

        return <primitive key={`map-${index}-${polygonIndex}`} object={new Line(geometry, material)} />;
      }) ?? []
    );
  });
};
