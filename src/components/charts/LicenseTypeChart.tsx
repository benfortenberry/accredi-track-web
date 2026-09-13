import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Warm off-white that reads well on the dark charcoal background
const labelColor = "#e8e0d6";
const gridColor  = "rgba(232, 224, 214, 0.1)";

export const options = {
  responsive: true,
  // Fill the fixed-height container instead of keeping a fixed aspect ratio,
  // so the chart is centered and uses the available space on all screen sizes.
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
      position: "top" as const,
      display: true,
      labels: { color: labelColor },
    },
    title: {
      display: true,
      color: labelColor,
      text: "License Status by Type",
    },
  },
};

function LicenseTypeChart(props: any) {
  return <Bar options={options} data={props.data} />;
}

export default LicenseTypeChart;
