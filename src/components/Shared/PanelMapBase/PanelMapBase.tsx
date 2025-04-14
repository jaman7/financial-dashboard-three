import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PanelMapBaseContent from './PanelMapBaseContent';
import { memo, Suspense } from 'react';
import Loader from '@/shared/components/Loader/Loader';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { IDictType } from '@/shared/model';
import './PanelMapBase.scss';

interface PanelMapBaseProps {
  geoJson: FeatureCollection<Geometry, GeoJsonProperties> | null;
  dict: IDictType[];
  ids: string[];
  mapWidth?: number;
}

const PanelMapBase: React.FC<PanelMapBaseProps> = ({ geoJson = null, dict = [], ids = [], mapWidth = 28 }) => {
  return (
    <div className="panel-map">
      <div className="panel-map__content">
        <Suspense fallback={<Loader />}>
          <Canvas camera={{ position: [0, 0, 16], fov: 50 }} gl={{ preserveDrawingBuffer: true }}>
            <OrbitControls
              enableZoom={true}
              zoomSpeed={1.5}
              minDistance={1}
              maxDistance={60}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
              enableRotate={false}
              enablePan={true}
            />

            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <PanelMapBaseContent geoJson={geoJson || null} dict={dict ?? []} ids={ids ?? []} mapWidth={mapWidth} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default memo(PanelMapBase);
