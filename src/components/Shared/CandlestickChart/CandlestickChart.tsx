import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Line } from 'recharts';
import { chartStyle } from '@/data/data';
import './CandlestickChart.scss';

interface CandlestickChartProps {
  currencyIds: string[];
  height: number;
  data?: any[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ currencyIds, data, height }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data?.map((entry) => ({
      date: entry.date,
      ...currencyIds?.reduce(
        (acc, currency) => {
          const key = currency.toLowerCase();
          acc[key] = entry[key] ?? null;
          return acc;
        },
        {} as Record<string, number | null>
      ),
    }));
  }, [data, currencyIds]);

  const maxYAxisValue = useMemo(() => {
    if (!data) return 0;
    return Math.max(...data?.flatMap((entry) => currencyIds?.map((currency) => entry[currency.toLowerCase()] ?? 0)));
  }, [data, currencyIds]);

  const dynamicYAxisWidth = useMemo(() => Math.max(40, maxYAxisValue.toString().length * 10), [maxYAxisValue]);

  return (
    <div className="candlestick-chart">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} {...chartStyle.chartOptions}>
          <XAxis dataKey="date" {...chartStyle.xAxis} />
          <YAxis width={dynamicYAxisWidth} {...chartStyle.yAxis} />
          <Tooltip {...chartStyle.tooltip} />

          <CartesianGrid strokeDasharray="3 3" />

          {currencyIds?.map((currency, index) => (
            <Line
              key={currency}
              type="monotone"
              dataKey={currency.toLowerCase()}
              stroke={chartStyle.colors[index % chartStyle.colors.length]} // Dynamiczny kolor
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 4, fill: chartStyle.colors[index % chartStyle.colors.length] }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart;
