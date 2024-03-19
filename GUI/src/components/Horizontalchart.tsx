import {
    Chart as Chartjs,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from "react-chartjs-2";
import React from 'react'

Chartjs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
    indexAxis: 'y' as const,
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            position: 'left',
        },
        title: {
            display: true,
            text: 'Zimular Data Viz',
        },
    },
};

const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgb(255, 99, 132)',
        },
        {
            label: 'My Second Dataset',
            data: [28, 48, 40, 19, 86, 27],
            backgroundColor: 'rgb(54, 162, 235)',
        }
    ],
};


const Horizontalchart = () => {

    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    )
}

export default Horizontalchart
