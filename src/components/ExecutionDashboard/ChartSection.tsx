import React from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { COLORS, ERROR_COLORS } from '../../constants/index';
import { ChartData } from '../../types/types';

interface ChartSectionProps {
  title: string;
  chartType: 'pie' | 'bar' | 'line';
  data: ChartData[];
  dataKey?: string;
  colors?: { [key: string]: string };
}

const renderCustomizedLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  if (value === 0) return null;
  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
};

const renderLineChartLabel = (props: any) => {
  const { x, y, value, stroke } = props;
  return (
    <text x={x} y={y} dy={-10} fill={stroke} fontSize={10} textAnchor="middle">
      {value}
    </text>
  );
};

export const ChartSection: React.FC<ChartSectionProps> = ({ title, chartType, data, dataKey, colors }) => {
  const renderChart = (): JSX.Element => {
    switch (chartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors ? colors[entry.name] : COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy={16}
                  textAnchor="end"
                  fill="#666"
                  className="text-xs"
                  transform={`rotate(-35, ${x}, ${y})`}
                >
                  {payload.value}
                </text>
              )}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            {dataKey ? ['Exitosa', 'Fallida', 'Pendiente'].map((status) => (
              <Bar key={status} dataKey={status} stackId="a" fill={COLORS[status as keyof typeof COLORS]}>
                <LabelList dataKey={status} content={renderCustomizedLabel} />
              </Bar>
            )) : ( <Bar dataKey="value" fill="#8884d8">
              <LabelList dataKey="value" content={renderCustomizedLabel} />
            </Bar>)}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.keys(ERROR_COLORS).map((errorType) => (
              <Line
                key={errorType}
                type="monotone"
                dataKey={errorType}
                stroke={ERROR_COLORS[errorType as keyof typeof ERROR_COLORS]}
                activeDot={{ r: 8 }}
              >
                <LabelList content={renderLineChartLabel} />
              </Line>
            ))}
          </LineChart>
        );
      default:
        return <div>No chart type selected</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h4 className="text-xl font-semibold mb-4 text-gray-800">{title}</h4>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};