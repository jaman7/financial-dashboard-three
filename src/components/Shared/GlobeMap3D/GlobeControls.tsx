import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { MdOutlineRestartAlt, MdOutlineSpeed } from 'react-icons/md';
import { FaArrowUp, FaArrowDown, FaCamera, FaPause, FaPlay } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import { mathOperation } from '@/shared/utils/math-operaation';
import { ReactNode, useMemo } from 'react';

export type GlobeCameraActionType = 'zoomIn' | 'zoomOut' | 'resetView' | 'tiltUp' | 'tiltDown' | 'resetPosition' | 'toggleViewMode';
export type GlobeRotationSpeedType = 'speedUp' | 'speedDown';
export type GlobeAutoRotateType = 'playStop';
export type GlobeActionType = GlobeCameraActionType | GlobeRotationSpeedType | GlobeAutoRotateType;

export interface IControlsCanvasConfig {
  action?: () => void;
  tooltip: string;
  icon: ReactNode;
  name?: GlobeActionType;
}

interface GlobeControlsProps {
  btnList?: GlobeActionType[] | null;
  setCameraAction: (action: GlobeCameraActionType) => void;
  setIsAutoRotate?: React.Dispatch<React.SetStateAction<boolean>>;
  isAutoRotate?: boolean;
  setRotationSpeed?: React.Dispatch<React.SetStateAction<number>>;
}

const GlobeControls: React.FC<GlobeControlsProps> = ({
  setIsAutoRotate,
  isAutoRotate,
  setCameraAction,
  setRotationSpeed,
  btnList = null,
}) => {
  const { t } = useTranslation();

  const controlsConfig: IControlsCanvasConfig[] = [
    { action: () => setCameraAction('zoomIn'), tooltip: 'common.glob3d.zoomIn', icon: <FiZoomIn />, name: 'zoomIn' },
    { action: () => setCameraAction('zoomOut'), tooltip: 'common.glob3d.zoomOut', icon: <FiZoomOut />, name: 'zoomOut' },
    { action: () => setCameraAction('resetView'), tooltip: 'common.glob3d.resetView', icon: <MdOutlineRestartAlt />, name: 'resetView' },
    { action: () => setCameraAction('tiltUp'), tooltip: 'common.glob3d.tiltUp', icon: <FaArrowUp />, name: 'tiltUp' },
    { action: () => setCameraAction('tiltDown'), tooltip: 'common.glob3d.tiltDown', icon: <FaArrowDown />, name: 'tiltDown' },
    { action: () => setCameraAction('toggleViewMode'), tooltip: 'common.glob3d.toggleView', icon: <FaCamera />, name: 'toggleViewMode' },
    {
      action: () => setRotationSpeed?.((prev) => Math.min(mathOperation(prev, 0.5), 5)),
      tooltip: 'common.glob3d.speedUp',
      icon: <MdOutlineSpeed />,
      name: 'speedUp',
    },
    {
      action: () => setRotationSpeed?.((prev) => Math.max(mathOperation(prev, 0.5, false), 0.5)),
      tooltip: 'common.glob3d.speedDown',
      icon: <MdOutlineSpeed />,
      name: 'speedDown',
    },
    {
      action: () => setIsAutoRotate?.(!isAutoRotate),
      tooltip: isAutoRotate ? 'common.glob3d.pause' : 'common.glob3d.rotate',
      icon: isAutoRotate ? <FaPause /> : <FaPlay />,
      name: 'playStop',
    },
  ];

  const controlsConfigFiltered = useMemo(() => {
    if (!btnList || btnList.length === 0) return controlsConfig;
    const allowed = new Set(btnList);
    return controlsConfig?.filter((c) => c.name && allowed.has(c.name));
  }, [btnList]);

  return (
    <div className="globe-controls">
      {controlsConfigFiltered?.map(
        (control, index: number) =>
          control && (
            <Button
              key={`controls_${index}`}
              handleClick={control?.action}
              tooltip={t(control?.tooltip)}
              variant={ButtonVariant.ROUND}
              aria-label={t(control.tooltip)}
              size="xs"
            >
              {control.icon}
            </Button>
          )
      )}
    </div>
  );
};

export default GlobeControls;
