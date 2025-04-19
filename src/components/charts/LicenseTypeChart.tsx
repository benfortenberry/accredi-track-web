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
    scales: {
        y: {
            ticks: {
                precision: 0,
                color: "white", 
            }
        },
        x: {
            ticks: {
                color: "white", 
            }
        }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        display: true,
        color: "white",
        labels: {
            color: "white",
        }
      },
      title: {
        display: true,
        color: 'white',
        text: 'License Status by Type',
      },
    },
  };

function LicenseTypeChart(props: any) {
    return (
        <Bar options={options} data={props.data} />
    );
  }
  
  export default LicenseTypeChart;
  