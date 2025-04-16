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

// 1) Import Switch and optionally FormControlLabel
import { Switch, FormControlLabel } from "@mui/material";

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

  // Chart initialization
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

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
              size: 16,
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
      {/* Chart container */}
      <div className="relative w-full h-48 md:h-64 bg-slate-950">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Toggle Section */}
      <div className="flex justify-center items-center space-x-8 mt-2">
        {/* 2) Use FormControlLabel around Switch for an integrated label */}
        <FormControlLabel
          label={<span style={{ fontSize: "0.8rem" }}>{"Close Price"}</span>}
          control={
            <Switch
              checked={showClose}
              onChange={() => setShowClose(!showClose)}
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: "#E2E8F0",
                },
              }}
            />
          }
        />

        <FormControlLabel
          label={<span style={{ fontSize: "0.8rem" }}>{"High Price"}</span>}
          control={
            <Switch
              checked={showHigh}
              onChange={() => setShowHigh(!showHigh)}
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: "#E2E8F0",
                },
              }}
            />
          }
        />

        <FormControlLabel
          label={<span style={{ fontSize: "0.8rem" }}>{"Low Price"}</span>}
          control={
            <Switch
              checked={showLow}
              onChange={() => setShowLow(!showLow)}
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: "#E2E8F0",
                },
              }}
            />
          }
        />
      </div>
    </div>
  );
};

export default StockChart;
