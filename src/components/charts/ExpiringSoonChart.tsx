import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const labelColor = "#e8e0d6";
const gridColor  = "rgba(232, 224, 214, 0.1)";

export const options = {
  responsive: true,
  // Fill the fixed-height container so the chart centers and uses available
  // space rather than holding a fixed aspect ratio.
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks:  { precision: 0, color: labelColor },
      grid:   { color: gridColor },
    },
    x: {
      ticks: { color: labelColor },
      grid:  { color: gridColor },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      color: labelColor,
      text: "Expiring Next 5 Months",
    },
  },
};

function ExpiringSoonChart(props: any) {
  return <Line options={options} data={props.data} />;
}

export default ExpiringSoonChart;
