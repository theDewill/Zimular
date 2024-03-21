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
  {name:"custom",Value:0.0}
]


const PieChartcomponent = ({data}:{data:any}) => {
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
          
          <Tooltip />
        </PieChart>
  )
}

export default PieChartcomponent;
