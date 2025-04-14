import { PerspectiveCamera } from 'three';

interface GlobeControlsMeterProps {
  cameraRef: React.RefObject<PerspectiveCamera | null>;
  rotationSpeed?: number;
}

const GlobeControlsMeter: React.FC<GlobeControlsMeterProps> = ({ cameraRef, rotationSpeed }) => {
  return (
    <div className="globe-controls-meter">
      <span>speed: {rotationSpeed}</span>
      <span>zoom: {cameraRef.current?.zoom}</span>
    </div>
  );
};

export default GlobeControlsMeter;
