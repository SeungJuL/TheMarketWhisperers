import React, { useState, useRef } from "react";
import PageWrapper from "../components/PageWrapper";
import StockChart from "../components/StockChart";

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
  const [leftWidth, setLeftWidth] = useState(30); // default 30% width for left column
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

      setMessage("Stock fetched successfully!");
      return finalData;
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server");
      return null;
    }
  };

  // ========== 4) MaterialToggle and MetricCard components ==========
  const MaterialToggle = ({ label, checked, onChange }) => {
    return (
      <label className="flex items-center space-x-2 text-slate-300 text-sm">
        <span>{label}</span>
        <div className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
        </div>
      </label>
    );
  };

  const MetricCard = ({ label, value, tooltip }) => (
    <div className="bg-slate-950 p-4 rounded-lg relative group shadow-sm">
      <div className="flex items-center mb-2">
        <span className="text-gray-300 text-sm">{label}</span>
        {tooltip && (
          <div className="ml-2">
            <span className="text-gray-400 cursor-help">ⓘ</span>
            <div className="absolute hidden group-hover:block bg-[#0B1120] text-white p-2 rounded-md text-xs z-10 w-48 shadow-lg">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="text-white font-semibold">{value}</div>
    </div>
  );

  // ========== 5) Render: if no stockData, then show only the centered search component ==========
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
                if (data) setStockData(data);
              }
            }}
          />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          {message && <p className="mt-2 text-green-500 text-sm">{message}</p>}
        </div>
      </PageWrapper>
    );
  }

  // ========== 6) Render full dashboard (when stockData exists) ==========
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
        {/* LEFT COLUMN (Chat area) */}
        <div
          className="flex flex-col h-full border-r border-slate-700"
          style={{ width: `${leftWidth}%`, minWidth: "200px" }}
        >
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
          className="flex flex-col h-full overflow-auto space-y-4 p-2 md:p-8"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {/* Row: search bar & toggles */}
          <div className="bg-slate-950 rounded-xl p-4 shadow-md flex items-center justify-between">
            {/* Left side: Search input */}
            <input
              type="text"
              placeholder="Search for a stock"
              className="flex-1 max-w-md bg-slate-900 text-white px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded mr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={async (evt) => {
                if (evt.key === "Enter") {
                  const data = await getStockData(searchQuery);
                  if (data) setStockData(data);
                }
              }}
            />
            {/* Right side: toggles */}
            <div className="flex gap-4 items-center">
              <MaterialToggle
                label="Show Tabs"
                checked={showTabs}
                onChange={() => setShowTabs((prev) => !prev)}
              />
              <MaterialToggle
                label="Metrics"
                checked={showMetrics}
                onChange={() => setShowMetrics((prev) => !prev)}
              />
              <MaterialToggle
                label="Chart"
                checked={showChart}
                onChange={() => setShowChart((prev) => !prev)}
              />
            </div>
          </div>

          {/* Stock Header */}
          <div className="bg-slate-950 rounded-xl p-4 shadow-md">
            <h1 className="text-2xl md:text-2xl font-bold text-white mb-2">
              {stockData.name} ({stockData.symbol})
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-xl md:text-xl text-blue-400">
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

          {/* Metrics Grid */}
          {showMetrics && (
            <div className="bg-slate-950 rounded-xl p-4 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
