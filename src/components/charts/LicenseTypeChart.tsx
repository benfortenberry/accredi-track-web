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
import { themeColor, themeColorAlpha } from "../../utils/themeColors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Build options at render time so label/grid colors resolve from the live
// daisyUI theme tokens (base-content), keeping the chart in sync with the rest
// of the UI rather than hardcoded off-white.
function buildOptions() {
  const labelColor = themeColor("base-content", "#e8e0d6");
  const gridColor = themeColorAlpha("base-content", 0.1, "rgba(232,224,214,0.1)");
  return {
    responsive: true,
    // Fill the fixed-height container instead of keeping a fixed aspect ratio,
    // so the chart is centered and uses the available space on all screens.
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
}

function LicenseTypeChart(props: any) {
  return <Bar options={buildOptions()} data={props.data} />;
}

export default LicenseTypeChart;
