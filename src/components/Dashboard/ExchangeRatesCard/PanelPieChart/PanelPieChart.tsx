import { FC, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { mathOperation } from '@/shared/utils/math-operaation';
import { chartStyle } from '@/data/data';
import { ICurrencyTableRow } from '@/components/Models/currency';

interface PanelPieChartProps {
  data?: ICurrencyTableRow[];
  currencyIds: string[];
  colors?: string[];
}

const PanelPieChart: FC<PanelPieChartProps> = ({ data, currencyIds, colors = chartStyle.colors }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return currencyIds?.map((currency) => {
      const rates = (data?.map((entry) => entry?.[currency.toLowerCase()])?.filter((rate) => rate !== undefined) ?? []) as number[];
      const avgRate = rates.length
        ? rates?.reduce((sum: number, rate: number) => mathOperation(sum as number, rate as number), 0) / rates.length
        : 0;

      return {
        name: currency.toUpperCase(),
        value: parseFloat(avgRate.toFixed(2)),
      };
    });
  }, [data, currencyIds]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    percent: number;
    index?: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const lineLength = 10;
    const textOffset = 2;
    const radius = outerRadius + lineLength;
    const x1 = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const y1 = cy + outerRadius * Math.sin(-midAngle * RADIAN);
    const x2 = cx + radius * Math.cos(-midAngle * RADIAN);
    const y2 = cy + radius * Math.sin(-midAngle * RADIAN);
    const textX = x2 + (x2 > cx ? textOffset : -textOffset);
    const textY = y2;

    return (
      <>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[index as number]} strokeWidth={1.5} />
        <text
          x={textX}
          y={textY}
          fill={colors[index as number]}
          textAnchor={x2 > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize={11}
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={55}
          fill={colors[0]}
          labelLine={false}
          label={renderCustomizedLabel}
          legendType="circle"
        >
          {chartData?.map((_, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
        </Pie>
        <Tooltip
          {...chartStyle.tooltip}
          formatter={(value, name: string) => {
            const seriesIndex = currencyIds.indexOf(name.toUpperCase());
            const color = colors[seriesIndex % colors.length];
            return <span style={{ color, fontWeight: 'bold' }}>{value}</span>;
          }}
          labelFormatter={(label) => label}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PanelPieChart;
