import React, {useContext, useEffect} from 'react'
import { Chart as ChartJS, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import { TransactionContext } from "../context/TransactionContext";

ChartJS.register(CategoryScale, LinearScale, Tooltip, Legend, BarElement);

export const LiveStats = () => {
    const { upPool, downPool } = useContext(TransactionContext);
    const chartData = {
        labels: ['UP', 'DOWN'],
        datasets: [
          {
            label: 'UP',
            data: [upPool], // 10
            borderColor: '#33185c',
            backgroundColor: '#33185c',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
          },
          {
            label: 'DOWN',
            data: [downPool], // 6
            borderColor: '#543c78',
            backgroundColor: '#543c78',
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
    
    useEffect(() => {
      chartData.datasets[0].data[0] = upPool
      chartData.datasets[1].data[0] = downPool
    }, []);

    return (
        <div className='bettingParent'>
        <h2>Live Statistics</h2>
        <div className='info-2'>
            <Bar data={chartData} options={options} />
        </div>
    </div>
    )
}
