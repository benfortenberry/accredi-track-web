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
import { themeColor, themeColorAlpha } from "../../utils/themeColors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Built at render time so colors resolve from the live daisyUI theme tokens,
// keeping the chart consistent with the rest of the UI.
function buildOptions() {
  const labelColor = themeColor("base-content", "#e8e0d6");
  const gridColor = themeColorAlpha("base-content", 0.1, "rgba(232,224,214,0.1)");
  return {
    responsive: true,
    // Fill the fixed-height container so the chart centers and uses available
    // space rather than holding a fixed aspect ratio.
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { precision: 0, color: labelColor },
        grid: { color: gridColor },
      },
      x: {
        ticks: { color: labelColor },
        grid: { color: gridColor },
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
}

function ExpiringSoonChart(props: any) {
  return <Line options={buildOptions()} data={props.data} />;
}

export default ExpiringSoonChart;
