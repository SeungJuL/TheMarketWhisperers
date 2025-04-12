import React, { useState, useRef } from "react";
import PageWrapper from "../components/PageWrapper";
import StockChart from "../components/StockChart";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("AI Insights");
  const [searchQuery, setSearchQuery] = useState("");

  // Toggles for right column sections
  const [showMetrics, setShowMetrics] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [showTabs, setShowTabs] = useState(true);

  // Draggable left column state
  const [leftWidth, setLeftWidth] = useState(30); // e.g., 30% width
  const dividerRef = useRef(null);

  // Mouse event handlers for the draggable divider
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

  // Example stock data
  const stockData = {
    name: "Apple Inc.",
    symbol: "AAPL",
    price: "222.46",
    change: "-0.60",
    metrics: {
      weekHighLow: "166.00 / 260.10",
      eps: "6.06",
      revenueGrowth: "2.02%",
      marketCap: "3.345T",
      volume: "40,521,968",
      avgVolume: "47,734,813",
      dividendYield: "0.45%",
      beta: "1.24",
      debtToEquity: "1.51",
      peRatio: "36.59",
    },
  };

  // Small component for each metric tile
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

  // Material-style toggle switch
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
            {/* Chat input at bottom */}
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
          {/* Search Bar row (with "Show Tabs" to the right) */}
          <div className="bg-slate-950 rounded-xl p-4 shadow-md flex items-center justify-between">
            {/* Left side: Search input */}
            <input
              type="text"
              placeholder="Search for a stock"
              className="flex-1 max-w-md bg-slate-900 text-white px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded mr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Right side: "Show Tabs" toggle */}
            <div className="flex gap-4 items-center">
              <MaterialToggle
                label="Show Tabs"
                checked={showTabs}
                onChange={() => setShowTabs((prev) => !prev)}
              />
              {/* Additional toggles for "Metrics" & "Chart" in a new row */}
              <MaterialToggle
                label="Metrics"
                checked={showMetrics}
                onChange={() => setShowMetrics(!showMetrics)}
              />
              <MaterialToggle
                label="Chart"
                checked={showChart}
                onChange={() => setShowChart(!showChart)}
              />
              {/* Could add more toggles here if needed */}
            </div>
          </div>

          {/* Stock Header */}
          <div className="bg-slate-950 rounded-xl p-4 shadow-md">
            <h1 className="text-2xl md:text-2xl font-bold text-white mb-2">
              {stockData.name} ({stockData.symbol})
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-xl md:text-xl text-blue-400">
                ${stockData.price}
              </span>
              <span className="text-red-500">({stockData.change}%)</span>
            </div>
          </div>

          {/* Metrics Grid */}
          {showMetrics && (
            <div className="bg-slate-950 rounded-xl p-3 shadow-md">
              <div className="grid grid-cols-4 md:grid-cols-3 gap-1">
                <MetricCard
                  label="52 Week High/Low"
                  value={stockData.metrics.weekHighLow}
                  tooltip="The highest and lowest stock price over the past 52 weeks"
                />
                <MetricCard
                  label="Earnings Per Share"
                  value={stockData.metrics.eps}
                  tooltip="Company's profit divided by outstanding shares"
                />
                <MetricCard
                  label="Revenue Growth"
                  value={stockData.metrics.revenueGrowth}
                  tooltip="Year-over-year revenue growth percentage"
                />
                <MetricCard
                  label="Market Cap"
                  value={stockData.metrics.marketCap}
                  tooltip="Total market value of company's outstanding shares"
                />
                <MetricCard
                  label="Volume/Average Volume"
                  value={`${stockData.metrics.volume} / ${stockData.metrics.avgVolume}`}
                  tooltip="Today's trading volume vs. 3-month average"
                />
                <MetricCard
                  label="Dividend Yield"
                  value={stockData.metrics.dividendYield}
                  tooltip="Annual dividend payments relative to stock price"
                />
                <MetricCard
                  label="Beta"
                  value={stockData.metrics.beta}
                  tooltip="Stock's volatility compared to the market"
                />
                <MetricCard
                  label="Debt-to-Equity"
                  value={stockData.metrics.debtToEquity}
                  tooltip="Total liabilities divided by shareholder equity"
                />
                <MetricCard
                  label="P/E Ratio"
                  value={stockData.metrics.peRatio}
                  tooltip="Stock price relative to earnings per share"
                />
              </div>
            </div>
          )}

          {/* Chart */}
          {showChart && (
            <div className="bg-slate-950 rounded-xl p-4 shadow-md">
              <StockChart
                historicalInfo={{
                  chartLabels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  chartClose: [
                    150, 158, 162, 160, 165, 170, 172, 175, 178, 182, 180, 185,
                  ],
                  chartHighs: [
                    153, 160, 165, 163, 168, 173, 175, 178, 182, 185, 183, 189,
                  ],
                  chartLows: [
                    148, 155, 159, 157, 161, 167, 169, 173, 175, 179, 177, 182,
                  ],
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
                    Technical analysis involves looking at price trends and
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
