"use client"

import React from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const data01 = [
  {name:"resource",Value:83.33},
  {name:"piorityresource",Value:0.0},
  {name:"peemptiveresource",Value:0.0},
  {name:"container",Value:0.0},
  {name:"store",Value:16.66},
  {name:"filterstore",Value:0.0},
  {name:"prioritystore",Value:0.0},
  {name:"custom",Value:0.0}]

const data02 = [
  { name: 'Group A', value: 2400 },
  { name: 'Group B', value: 4567 },
  { name: 'Group C', value: 1398 },
  { name: 'Group D', value: 9800 },
  { name: 'Group E', value: 3908 },
  { name: 'Group F', value: 4800 },
];

const PieChartcomponent = () => {
  return (
    <PieChart width={400} height={400}>
          <Pie
            dataKey="Value"
            isAnimationActive={true}
            data={data01}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Pie dataKey="Value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
          <Tooltip />
        </PieChart>
  )
}

export default PieChartcomponent;
