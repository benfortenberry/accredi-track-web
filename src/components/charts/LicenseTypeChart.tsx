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
                precision: 0
            }
        }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        display: true
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
    },
  };

function LicenseTypeChart(props: any) {
    return (
        <Bar options={options} data={props.data} />
    );
  }
  
  export default LicenseTypeChart;
  