import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@/shared/components/button/Button';
import { IButtonsTimeFrameType } from './FiltersChartButtons.types';
import { dateRanges, timeframes } from './FiltersChartButtons.config';
import './FiltersChartButtons.scss';

interface FiltersChartButtonsProps {
  selectedTimeframe?: IButtonsTimeFrameType;
  selectedDateRange?: number;
  onTimeframeChange?: (timeframe: IButtonsTimeFrameType) => void;
  onDateRangeChange?: (dateRange: number) => void;
  isTimeframe?: boolean;
  allowedDateRanges?: number[];
}

const FiltersChartButtons: React.FC<FiltersChartButtonsProps> = ({
  selectedTimeframe = '1D',
  selectedDateRange = 30,
  isTimeframe = true,
  allowedDateRanges = dateRanges.map((dr) => dr.value),
  onTimeframeChange,
  onDateRangeChange,
}) => {
  const [currentTimeframe, setCurrentTimeframe] = useState<IButtonsTimeFrameType>(selectedTimeframe);
  const [currentDateRange, setCurrentDateRange] = useState<number>(selectedDateRange);

  const filteredTimeframes = useMemo(
    () => (currentDateRange <= 7 ? timeframes?.filter((tf) => tf.value !== '1W') : timeframes),
    [currentDateRange]
  );

  const filteredDateRanges = useMemo(() => dateRanges?.filter((dr) => allowedDateRanges.includes(dr.value)), [allowedDateRanges]);

  useEffect(() => {
    if (currentDateRange === 7 && currentTimeframe === '1W') {
      setCurrentTimeframe?.('1D');
      onTimeframeChange?.('1D');
    }
  }, [currentDateRange, currentTimeframe, onTimeframeChange]);

  const handleTimeframeClick = useCallback(
    (tf: IButtonsTimeFrameType) => {
      setCurrentTimeframe?.(tf);
      onTimeframeChange?.(tf);
    },
    [onTimeframeChange]
  );

  const handleDateRangeClick = useCallback(
    (range: number) => {
      setCurrentDateRange?.(range);
      onDateRangeChange?.(range);
    },
    [onDateRangeChange]
  );

  return (
    <div className="filters-charts-buttons">
      {isTimeframe && (
        <div className="buttons-container">
          {filteredTimeframes?.map((tf, i) => (
            <Button
              key={`timeframe-buttons-${i}`}
              handleClick={() => handleTimeframeClick(tf.value)}
              active={selectedTimeframe === tf.value}
              size="xs"
            >
              {tf.label}
            </Button>
          ))}
        </div>
      )}
      <div className="buttons-container">
        {filteredDateRanges?.map((range, i) => (
          <Button
            key={`range-buttons-${i}`}
            handleClick={() => handleDateRangeClick(range.value)}
            active={selectedDateRange === range.value}
            size="xs"
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FiltersChartButtons;
