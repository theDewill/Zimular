"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MultiLineChartComponent = ({data}:{data:any}) => {
  return(
    <LineChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" />
    <YAxis dataKey="amount"/>
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="" stroke="#8884d8" activeDot={{ r: 8 }} />
    <Line type="monotone" dataKey="amount" stroke="#000000" />
    <Line type="monotone" dataKey="" stroke="#000000" />
    
  </LineChart>
  )
}

export default MultiLineChartComponent;
