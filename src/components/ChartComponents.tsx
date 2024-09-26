import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LabelList,
} from "recharts";

interface PieChartComponentProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Legend verticalAlign="bottom" height={36} />
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

interface BarChartComponentProps {
  data: Array<{ name: string; [key: string]: any }>;
  dataKey: string;
  fill: string;
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, dataKey, fill }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={dataKey} fill={fill}>
        <LabelList dataKey={dataKey} position="insideBottom" offset={25} fill="#fff" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

interface RadarChartComponentProps {
  data: Array<{ stage: string; [key: string]: number | string }>;
  dataKey: string;
  name: string;
  stroke: string;
  fill: string;
}

export const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ data, dataKey, name, stroke, fill }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart outerRadius={90} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="stage" />
      <PolarRadiusAxis angle={30} domain={[0, 100]} />
      <Radar
        name={name}
        dataKey={dataKey}
        stroke={stroke}
        fill={fill}
        fillOpacity={0.6}
      />
      <Tooltip />
    </RadarChart>
  </ResponsiveContainer>
);

interface LineChartComponentProps {
  data: Array<{ name: string; [key: string]: any }>;
  lines: Array<{ dataKey: string; stroke: string; name: string }>;
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({ data, lines }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" interval={0} tick={false} height={1} />
      <YAxis />
      <Tooltip />
      <Legend />
      {lines.map((line, index) => (
        <Line
          key={index}
          type="monotone"
          dataKey={line.dataKey}
          stroke={line.stroke}
          name={line.name}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);