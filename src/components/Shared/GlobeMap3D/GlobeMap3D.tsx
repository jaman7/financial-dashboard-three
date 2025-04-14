import Globe from './Globe';
import { colors } from '@/data/data';
import { FeatureCollection, Geometry } from 'geojson';
import { IMarker } from './GlobeMap3D.model';
import './GlobeMap3D.scss';

const earthTextureURL = 'images/earth_texture.png';
const earthBumpMapURL = 'images/earth_bump_map.jpg';
const earthSpecularMapURL = 'images/earth_specular_map.jpg';

interface GlobeMap3DProps {
  markers?: IMarker[];
  geoJson?: FeatureCollection<Geometry> | null;
  containerSize?: { width: number; height: number };
}

const GlobeMap3D: React.FC<GlobeMap3DProps> = ({ markers = [], geoJson = null, containerSize = { width: 500, height: 500 } }) => {
  return (
    <Globe
      markers={markers ?? []}
      geoJson={geoJson}
      textures={{
        map: earthTextureURL,
        bumpMap: earthBumpMapURL,
        specularMap: earthSpecularMapURL,
      }}
      markerColor={colors.lightBlue}
      containerSize={containerSize}
    />
  );
};

export default GlobeMap3D;
