import React from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  import { Bar } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Zim Data viz',
      },
    },
  };

  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgb(255, 99, 132)',
        },
        {
            label: 'My Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 56],
            backgroundColor: 'rgb(54, 162, 235)',
        }
    ],
};

type Props = {}

const Verticalchart = () => {
  return <Bar data={data} options={options} />;
  
}

export default Verticalchart
