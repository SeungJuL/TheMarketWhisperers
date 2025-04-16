import React, { useState, useRef } from "react";
import PageWrapper from "../components/PageWrapper";
import StockChart from "../components/StockChart";
import { Switch, FormControlLabel } from "@mui/material";

const DashboardPage = () => {
  // ========== 1) UI State ==========
  const [activeTab, setActiveTab] = useState("AI Insights");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockData, setStockData] = useState(null); // When null, show only the search view
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Toggles for sections (only visible in full dashboard view)
  const [showMetrics, setShowMetrics] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [showTabs, setShowTabs] = useState(true);

  // ========== 2) Draggable left column (Chat) state ==========
  const [leftWidth, setLeftWidth] = useState(30); // default 30% width
  const dividerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 15 && newLeftWidth < 75) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // ========== 3) Backend Fetch Logic ==========
  const parseDate = (dateStr) => {
    const cleanedDateStr = dateStr.replace(/^[A-Za-z]{3},\s/, "");
    const dateObj = new Date(cleanedDateStr);
    if (isNaN(dateObj.getTime())) {
      console.error(`Invalid date: ${dateStr}`);
      return null;
    }
    return dateObj;
  };

  const getStockData = async (stockName) => {
    setMessage("");
    setError("");
    try {
      const searchRes = await fetch(
        "http://localhost:8080/stock/search?stock_name=" + stockName
      );
      const stocks = await searchRes.json();
      if (!stocks.success || !stocks.data || !stocks.data[0]) {
        setError(`Fetch stock failed! ${stocks.message || ""}`);
        return null;
      }

      const symbol = stocks.data[0]["1. symbol"];
      // Fetch price
      const priceRes = await fetch(
        `http://localhost:8080/stock/${symbol}/price?asset_symbol=${symbol}`
      );
      const priceJson = await priceRes.json();

      // Fetch stock info
      const infoRes = await fetch(`http://localhost:8080/stock/${symbol}/info`);
      const infoJson = await infoRes.json();

      // Fetch historical data
      const histRes = await fetch(
        `http://localhost:8080/stock/${symbol}/history`
      );
      const histJson = await histRes.json();

      // Build chart arrays
      const rawDates = histJson.data.map((item) => item.Date);
      const chartLabels = [];
      const chartClose = [];
      const chartHighs = [];
      const chartLows = [];

      for (let i = 0; i < rawDates.length - 1; i++) {
        const dateObj = parseDate(rawDates[i]);
        if (!dateObj) continue;
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          timeZone: "UTC",
        }).format(dateObj);
        chartLabels.push(formattedDate);
        chartClose.push(histJson.data[i]["Close"]);
        chartHighs.push(histJson.data[i]["High"]);
        chartLows.push(histJson.data[i]["Low"]);
      }

      const latestClose = histJson.data[histJson.data.length - 2]["Close"] || 0;
      const currentPrice = priceJson.data["price"];
      const calcChange = ((currentPrice - latestClose) / latestClose) * 100;
      const formattedMarketCap = new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
      }).format(infoJson.data["market_cap"]);

      const finalData = {
        name: stocks.data[0]["2. name"],
        symbol,
        price: currentPrice,
        change: calcChange,
        chartLabels,
        chartClose,
        chartHighs,
        chartLows,
        metrics: {
          weekHighLow:
            parseFloat(infoJson.data["52_week_high"]).toFixed(2) +
            " / " +
            parseFloat(infoJson.data["52_week_low"]).toFixed(2),
          eps: infoJson.data["eps"],
          revenueGrowth:
            (infoJson.data["revenue_growth"] * 100).toFixed(2) + "%",
          marketCap: formattedMarketCap,
          volume: infoJson.data["volume"],
          avgVolume: infoJson.data["average_volume"],
          dividendYield: infoJson.data["dividend_yield"] || 0,
          beta: infoJson.data["beta"],
          debtToEquity: infoJson.data["debt_to_equity"],
          peRatio: infoJson.data["pe_ratio"],
        },
      };

      // Return final data on success
      return finalData;
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server");
      return null;
    }
  };

  // ========== 4) MetricCard component ==========
  const MetricCard = ({ label, value, tooltip }) => (
    <div className="bg-slate-950 p-2 rounded-lg shadow-sm">
      {/* Label & Icon */}
      <div className="flex items-center space-x-1 text-xs text-gray-300">
        <span>{label}</span>
        {tooltip && (
          <div className="relative group flex  items-center">
            <svg
              data-slot="icon"
              fill="#f5f5f5"
              viewBox="0 0 16 16"
              className="h-3 w-3 text-gray-400 cursor-help"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
              />
            </svg>
            {/* Tooltip: hidden by default; displayed on hover */}
            <div className="absolute hidden group-hover:block top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-[#0B1120] text-white p-2 rounded-md text-xs shadow-lg z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>

      {/* Value text */}
      <div className="text-white font-semibold text-sm mt-1">{value}</div>
    </div>
  );

  // ========== 5) No stock data: show search ==========
  if (!stockData) {
    return (
      <PageWrapper>
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-white text-2xl mb-4">Search for a Stock</h1>
          <input
            type="text"
            textAlign="center"
            style={{ width: "300px", height: "50px", fontSize: "18px" }}
            className="w-full bg-slate-950 text-white px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={async (evt) => {
              if (evt.key === "Enter") {
                const data = await getStockData(searchQuery);
                if (data) {
                  setStockData(data);
                  setSearchQuery(""); // Clear search on success
                }
              }
            }}
          />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          {message && <p className="mt-2 text-green-500 text-sm">{message}</p>}
        </div>
      </PageWrapper>
    );
  }

  // ========== 6) Render full dashboard ==========
  return (
    <PageWrapper>
      <div className="pt-28"></div>
      <div
        className="mx-auto w-full flex"
        style={{
          userSelect: "none",
          height: "calc(100vh - 8rem)",
        }}
      >
        {/* LEFT COLUMN (Search + Chat) */}
        <div
          className="flex flex-col h-full border-r border-slate-700 md:p-4"
          style={{ width: `${leftWidth}%`, minWidth: "220px" }}
        >
          {/* Search bar above chat */}
          <div className="bg-slate-950 rounded-xl p-4 mb-4 shadow-md">
            <input
              type="text"
              placeholder="Search for a stock"
              className="w-full bg-slate-900 text-white px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={async (evt) => {
                if (evt.key === "Enter") {
                  const data = await getStockData(searchQuery);
                  if (data) {
                    setStockData(data);
                    setSearchQuery(""); // Clear search on success
                  }
                }
              }}
            />
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            {message && (
              <p className="mt-2 text-green-500 text-sm">{message}</p>
            )}
          </div>

          {/* Chat box */}
          <div className="bg-slate-950 rounded-xl p-4 flex flex-col h-full shadow-md">
            <div className="mb-4 text-gray-100 font-semibold text-lg">
              AI Chat
            </div>
            {/* Chat log */}
            <div className="flex-grow overflow-y-auto p-2 mb-4 rounded-lg text-gray-200 space-y-1">
              <p>
                <strong className="text-gray-100">User:</strong> Hello, AI!
              </p>
              <p>
                <strong className="text-gray-100">AI:</strong> Hi there! How can
                I help you today?
              </p>
            </div>
            {/* Chat input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask me anything"
                className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Draggable Divider */}
        <div
          ref={dividerRef}
          onMouseDown={handleMouseDown}
          className="w-[6px] bg-slate-600 cursor-col-resize"
        />

        {/* RIGHT COLUMN */}
        <div
          className="flex flex-col h-full overflow-auto space-y-4 md:p-4"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {/* Stock Header + Toggles */}
          <div className="bg-slate-950 rounded-xl p-4 shadow-md">
            {/* 1) Use flex-wrap here so toggles never escape the card */}
            <div className="flex flex-wrap items-center justify-between gap-y-2">
              {/* Stock info on the left */}
              <div>
                <h1 className="text-xl font-bold text-white mb-2">
                  {stockData.name} ({stockData.symbol})
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="text-xl text-blue-400">
                    ${parseFloat(stockData.price).toFixed(2)}
                  </span>
                  <span
                    className={
                      stockData.change >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    ({parseFloat(stockData.change).toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Toggles on the right - they will wrap on small screens */}
              <div className="flex gap-8 items-center">
                <FormControlLabel
                  label={
                    <span style={{ fontSize: "0.8rem" }}>{"Show Tabs"}</span>
                  }
                  labelPlacement="end"
                  control={
                    <Switch
                      checked={showTabs}
                      onChange={() => setShowTabs((prev) => !prev)}
                      color="primary"
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "#E2E8F0",
                        },
                      }}
                    />
                  }
                />
                <FormControlLabel
                  label={
                    <span style={{ fontSize: "0.8rem" }}>{"Metrics"}</span>
                  }
                  labelPlacement="end"
                  control={
                    <Switch
                      checked={showMetrics}
                      onChange={() => setShowMetrics((prev) => !prev)}
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "#E2E8F0",
                        },
                      }}
                    />
                  }
                />
                <FormControlLabel
                  label={<span style={{ fontSize: "0.8rem" }}>{"Chart"}</span>}
                  labelPlacement="end"
                  control={
                    <Switch
                      checked={showChart}
                      onChange={() => setShowChart((prev) => !prev)}
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
          </div>

          {/* Metrics Grid */}
          {showMetrics && (
            <div className="bg-slate-950 rounded-xl p-2 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <MetricCard
                  label="52 Wk High/Low"
                  value={stockData.metrics.weekHighLow}
                  tooltip="Highest/lowest stock price over the past 52 weeks"
                />
                <MetricCard
                  label="Earnings Per Share"
                  value={stockData.metrics.eps}
                  tooltip="Profit / outstanding shares"
                />
                <MetricCard
                  label="Revenue Growth"
                  value={stockData.metrics.revenueGrowth}
                  tooltip="Year-over-year revenue growth"
                />
                <MetricCard
                  label="Market Cap"
                  value={stockData.metrics.marketCap}
                  tooltip="Total market value of outstanding shares"
                />
                <MetricCard
                  label="Volume/Average Volume"
                  value={`${Number(
                    stockData.metrics.volume
                  ).toLocaleString()} / ${Number(
                    stockData.metrics.avgVolume
                  ).toLocaleString()}`}
                  tooltip="Today's volume vs. 3-month average"
                />
                <MetricCard
                  label="Dividend Yield"
                  value={stockData.metrics.dividendYield}
                  tooltip="Annual dividend payments / stock price"
                />
                <MetricCard
                  label="Beta"
                  value={parseFloat(stockData.metrics.beta).toFixed(2)}
                  tooltip="Volatility measure vs. market"
                />
                <MetricCard
                  label="Debt-to-Equity"
                  value={parseFloat(stockData.metrics.debtToEquity).toFixed(2)}
                  tooltip="Liabilities / equity ratio"
                />
                <MetricCard
                  label="P/E Ratio"
                  value={parseFloat(stockData.metrics.peRatio).toFixed(2)}
                  tooltip="Price relative to earnings"
                />
              </div>
            </div>
          )}

          {/* Chart */}
          {showChart && stockData && (
            <div className="bg-slate-950 rounded-xl p-4 shadow-md">
              <StockChart
                historicalInfo={{
                  chartLabels: stockData.chartLabels,
                  chartClose: stockData.chartClose,
                  chartHighs: stockData.chartHighs,
                  chartLows: stockData.chartLows,
                }}
              />
            </div>
          )}

          {/* Tabs */}
          {showTabs && (
            <div className="bg-slate-950 rounded-xl p-4 shadow-md">
              <div className="flex space-x-2 border-b border-slate-600 pb-2 mb-4 justify-center">
                {[
                  "AI Insights",
                  "Company Background",
                  "Fundamentals",
                  "Technicals",
                ].map((tab) => (
                  <button
                    key={tab}
                    className={`py-1 px-2 text-sm rounded-lg ${
                      activeTab === tab
                        ? "bg-[#0B1120] text-blue-400"
                        : "bg-[#2A3A50] text-gray-300 hover:bg-[#0B1120] hover:text-white"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-gray-300">
                {activeTab === "AI Insights" && (
                  <p>
                    Apple Inc. (AAPL) remains a strong long-term investment...
                  </p>
                )}
                {activeTab === "Company Background" && (
                  <p>
                    Apple was founded in 1976, headquartered in Cupertino...
                  </p>
                )}
                {activeTab === "Fundamentals" && (
                  <p>
                    Fundamentals typically include P/E ratio, EPS, revenue
                    growth...
                  </p>
                )}
                {activeTab === "Technicals" && (
                  <p>
                    Technical analysis involves analyzing price trends and
                    volume...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
