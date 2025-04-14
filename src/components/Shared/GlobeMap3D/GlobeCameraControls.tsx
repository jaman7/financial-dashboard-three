import { useEffect } from 'react';
import { PerspectiveCamera } from 'three';
import { GlobeCameraActionType } from './GlobeControls';
import { mathOperation } from '@/shared/utils/math-operaation';

interface GlobeCameraControlsProps {
  cameraRef: React.RefObject<PerspectiveCamera | null>;
  cameraAction: GlobeCameraActionType | null;
  setCameraAction: (action: null) => void;
}

const GlobeCameraControls: React.FC<GlobeCameraControlsProps> = ({ cameraRef, cameraAction, setCameraAction }) => {
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam || !cameraAction) return;

    const actionsMap: Record<GlobeCameraActionType, () => void> = {
      zoomIn: () => {
        cam.zoom = Math.min(mathOperation(cam.zoom, 0.1), 2);
        cam.updateProjectionMatrix();
      },
      zoomOut: () => {
        cam.zoom = Math.max(mathOperation(cam.zoom, 0.1, false), 0.5);
        cam.updateProjectionMatrix();
      },
      resetView: () => {
        cam.zoom = 1;
        cam.position.set(0, 0, 3);
        cam.lookAt(0, 0, 0);
        cam.updateProjectionMatrix();
      },
      tiltUp: () => {
        cam.position.y += 0.2;
      },
      tiltDown: () => {
        cam.position.y -= 0.2;
      },
      toggleViewMode: () => {
        cam.fov = cam.fov === 50 ? 30 : 50;
        cam.updateProjectionMatrix();
      },
      resetPosition: () => {
        cam.position.set(0, 0, 3);
        cam.lookAt(0, 0, 0);
        cam.updateProjectionMatrix();
      },
    };

    actionsMap[cameraAction]?.();

    setCameraAction(null);
  }, [cameraAction, cameraRef]);

  return null;
};

export default GlobeCameraControls;
