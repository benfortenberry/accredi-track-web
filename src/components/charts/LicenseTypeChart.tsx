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
                color: "black", 
            }
        },
        x: {
            ticks: {
                color: "black", 
            }
        }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        display: true,
        color: "black",
        labels: {
            color: "black",
        }
      },
      title: {
        display: true,
        color: 'black',
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
  