import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    PointElement,
    LineElement,
    Tooltip,
    Legend
  );

 
  export const options = {
    responsive: true,
    scales: {
        y: {
            ticks: {
                precision: 0,
                color: "#171b2f", 
            }
        },
        x: {
            ticks: {
                color: "#171b2f", 
            }
        }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
        color: "#171b2f",
        labels: {
            color: "#171b2f",
        }
      },
      title: {
        display: true,
        color: '#171b2f',
        text: 'Expiring Next 5 Months',
      },
    },
  };

function ExpiringSoonChart(props: any) {

    
    return (
        <Line options={options} data={props.data} />
    );
  }
  
  export default ExpiringSoonChart;
  