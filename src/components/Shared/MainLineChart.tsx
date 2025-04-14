import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { chartStyle } from '@/data/data';

interface MainLineChartProps {
  dataKeyX: string;
  dataKeyY: string | string[];
  height?: number;
  chartData: Record<string, any>[];
  colors?: string[];
}

const MainLineChart: React.FC<MainLineChartProps> = ({
  height = 150,
  chartData = [],
  dataKeyX = 'data',
  dataKeyY = 'value',
  colors = chartStyle.colors,
}) => {
  const isMultipleSeries = Array.isArray(dataKeyY);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} {...chartStyle.chartOptions}>
        <XAxis dataKey={dataKeyX} {...chartStyle.xAxis} />
        <YAxis {...chartStyle.yAxis} width={55} />
        <Tooltip
          {...chartStyle.tooltip}
          formatter={(value, name) => {
            const seriesIndex = isMultipleSeries ? (dataKeyY as string[]).indexOf(name as string) : 0;
            const color = colors[seriesIndex % colors.length];
            return <span style={{ color, fontWeight: 'bold' }}>{value}</span>;
          }}
          labelFormatter={(label) => label}
        />

        {isMultipleSeries ? (
          (dataKeyY as string[]).map((key, index) => (
            <Line
              key={key}
              dataKey={key.toLowerCase()}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 4, fill: colors[index % colors.length] }}
            />
          ))
        ) : (
          <Line dataKey={dataKeyY as string} stroke={colors[0]} strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4, fill: colors[0] }} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MainLineChart;
