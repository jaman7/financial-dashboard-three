import { useCallback, useMemo, useRef, useState } from 'react';
import { Group } from 'three';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { convertLatLngToVector3 } from '@/shared/utils/convertLatLngToVector';
import Tooltip from '@/shared/components/tooltip/Tooltip';
import { IMarker } from './GlobeMap3D.model';
import './Markers.scss';

interface MarkersProps {
  markers?: IMarker[];
  pointColor: string;
  setIsAutoRotate: (hovered: boolean) => void;
}

const Markers: React.FC<MarkersProps> = ({ markers = [], pointColor = '#deffd8', setIsAutoRotate }) => {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const markerRefs = useRef<(Group | null)[]>(new Array(markers.length).fill(null));

  const { camera } = useThree();

  const positions = useMemo(() => {
    return markers.map((marker) => convertLatLngToVector3(marker?.coordinates?.[1] as number, marker?.coordinates?.[0] as number, 1.01));
  }, [markers]);

  const handlePointerOver = useCallback((id: number) => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    setHoveredMarkerId(id);
    setIsAutoRotate(false);
    setShowTooltip(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    tooltipTimeout.current = setTimeout(() => {
      setShowTooltip(false);
      setHoveredMarkerId(null);
      setIsAutoRotate(true);
    }, 3000);
  }, []);

  return (
    <>
      {markers?.map((marker, index) => {
        const position = positions[index];
        const markerId = marker.id;

        return (
          <group
            key={markerId}
            ref={(el) => (markerRefs.current[index] = el)}
            position={position.toArray()}
            onPointerOver={() => handlePointerOver(markerId)}
            onPointerOut={handlePointerOut}
            onUpdate={(self) => self.lookAt(camera.position)}
          >
            <mesh>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshBasicMaterial color={marker?.pointColor ?? pointColor} />
            </mesh>
            {showTooltip && hoveredMarkerId === markerId && (
              <Html center distanceFactor={10} position={[0, 0.04, 0]}>
                <Tooltip
                  content={
                    Array.isArray(marker?.name)
                      ? marker.name.map((name) => (
                          <div key={name} style={{ color: marker.pointColor ?? pointColor }}>
                            {name}
                          </div>
                        ))
                      : marker.name
                  }
                  position="top"
                  size="marker"
                />
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
};

export default Markers;
