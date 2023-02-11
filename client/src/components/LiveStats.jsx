import React from 'react'
import { Chart as ChartJS, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, Tooltip, Legend, BarElement);

export const LiveStats = () => {
    const chartData = {
        labels: ['UP', 'DOWN'],
        datasets: [
          {
            label: 'UP',
            data: [3],
            borderColor: 'aqua',
            backgroundColor: 'greenyellow',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
          },
          {
            label: 'DOWN',
            data: [10],
            borderColor: 'aqua',
            backgroundColor: 'lightred',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
          }
        ]
      };
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Live Poll'
          }
        }
      }

    return (
        <div className='bettingParent'>
        <h2>Live Statistics</h2>
        <div className='info-2'>
            <Bar data={chartData} options={options} />
        </div>
    </div>
    )
}
