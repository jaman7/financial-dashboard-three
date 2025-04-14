import { FC } from 'react';
import './ProgressBar.scss';

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
}

const ProgressBar: FC<ProgressBarProps> = ({ label, value, color }) => {
  return (
    <div className="progress-bar">
      <span className="progress-bar__label">{label}</span>
      <div className="progress-bar__wrapper">
        <div
          className="progress-bar__bar"
          aria-valuenow={value ?? 0}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            width: `${Math.min(value, 100)}%`,
            backgroundColor: color,
          }}
        >
          <span className="progress-bar__value">{value?.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
