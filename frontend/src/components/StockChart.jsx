import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const StockChart = ({ historicalInfo }) => {
  const { chartLabels, chartClose, chartHighs, chartLows } = historicalInfo;
  const [showClose, setShowClose] = useState(true);
  const [showHigh, setShowHigh] = useState(false);
  const [showLow, setShowLow] = useState(false);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // Effect to handle chart rendering
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Prevent duplicate canvas errors
    }

    const ctx = canvasRef.current.getContext("2d");

    // Prepare the datasets based on toggles
    const datasets = [];

    if (showClose) {
      datasets.push({
        label: "Close Price",
        data: chartClose,
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.3,
        pointRadius: 2,
      });
    }

    if (showHigh) {
      datasets.push({
        label: "High Price",
        data: chartHighs,
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
        pointRadius: 2,
      });
    }

    if (showLow) {
      datasets.push({
        label: "Low Price",
        data: chartLows,
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.3,
        pointRadius: 2,
      });
    }

    // Initialize the chart with the dynamic datasets
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "category",
            ticks: { color: "#ccc" },
            grid: { display: false },
          },
          y: {
            ticks: { color: "#ccc" },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#fff",
            },
          },
          title: {
            display: true,
            text: "Stock Price History",
            font: {
              size: 18,
              weight: "bold",
            },
            color: "#fff",
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [
    chartLabels,
    chartClose,
    chartHighs,
    chartLows,
    showClose,
    showHigh,
    showLow,
  ]);

  return (
    <div className="w-full">
      {/* Chart container with a fixed aspect ratio via h-96 */}
      <div className="relative w-full h-72 md:h-96 bg-slate-950">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Checkbox Section Below the Graph */}
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showClose}
            onChange={() => setShowClose((prev) => !prev)}
            className="mr-2"
          />
          <label className="text-white">Close Price</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showHigh}
            onChange={() => setShowHigh((prev) => !prev)}
            className="mr-2"
          />
          <label className="text-white">High Price</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showLow}
            onChange={() => setShowLow((prev) => !prev)}
            className="mr-2"
          />
          <label className="text-white">Low Price</label>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
