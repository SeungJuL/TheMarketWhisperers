import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import StockChart from "../components/StockChart";
import { Switch, FormControlLabel, CircularProgress } from "@mui/material";

const DashboardPage = () => {
  // Page states and data
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("AI Insights");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [stockData, setStockData] = useState(null);
  
  // UI states
  const [isVisible, setIsVisible] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [showTabs, setShowTabs] = useState(true);
  
  // Loading and error states
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isMainSearchLoading, setIsMainSearchLoading] = useState(false);
  const [isSmallSearchLoading, setIsSmallSearchLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Left sidebar width for draggable feature
  const [leftWidth, setLeftWidth] = useState(30);
  const dividerRef = useRef(null);

  // Update watchlist status when stock changes
  useEffect(() => {
    if (stockData?.symbol) {
      fetchWatchlistStatus(stockData.symbol);
    }
  }, [stockData]);

  // Load stock data from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stock = params.get("stock");
    if (stock && stock.trim() !== "" && stock !== "undefined") {
      setSearchQuery(stock);
      getStockData(stock).then((val) => {
        setStockData(val);
      });
    } else {
      setSearchQuery("");
      setStockData(null);
    }
  }, [location]);

  // Mouse handlers for draggable sidebar
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

  // Stock search handlers
  const getMainStockData = async (stockName) => {
    setMessage("");
    setError("");
    setIsMainSearchLoading(true);
    try {
      const data = await getStockData(stockName);
      if (data) {
        setStockData(data);
        setSearchQuery("");
      }
    } catch (error) {
      setError("Failed to fetch stock data");
    } finally {
      setIsMainSearchLoading(false);
    }
  };

  const getSmallStockData = async (stockName) => {
    setMessage("");
    setError("");
    setIsSmallSearchLoading(true);
    try {
      const data = await getStockData(stockName);
      if (data) {
        setStockData(data);
        setSearchQuery("");
      }
    } catch (error) {
      setError("Failed to fetch stock data");
    } finally {
      setIsSmallSearchLoading(false);
    }
  };

  // Core data fetching functions
  const getStockData = async (stockName) => {
    setMessage("");
    setError("");
    if (!isAiLoading) {  // AI 채팅 중이 아닐 때만 isLoading 상태 변경
      setIsMainSearchLoading(true);
    }
    try {
      const searchRes = await fetch(
        "http://localhost:8080/stock/search?stock_name=" + stockName
      );
      const stocks = await searchRes.json();
      if (!stocks.success || !stocks.data || !stocks.data[0]) {
        setError(`Fetch stock failed! ${stocks.message || ""}`);
        if (!isAiLoading) {
          setIsMainSearchLoading(false);
        }
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

      // Fetch AI Insight
      const insightRes = await fetch(`http://localhost:8080/ai/insight/${symbol}`);
      const insightJson = await insightRes.json();
      const insight = JSON.stringify(insightJson.data);
      const parsedAIInsight = JSON.parse(insight);

      // Fetch Company Background
      const backgroundRes = await fetch(`http://localhost:8080/stock/${symbol}/background`);
      const bckgrdJson = await backgroundRes.json();

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
        aiInsight: parsedAIInsight,
        // Company Background Data
        industry: bckgrdJson.data.basic_info.industry,
        sector: bckgrdJson.data.basic_info.sector,
        website: bckgrdJson.data.basic_info.website,
        name: bckgrdJson.data.basic_info.name,
        // Location
        country: bckgrdJson.data.location.country,
        city: bckgrdJson.data.location.city,
        state: bckgrdJson.data.location.state,
        address: bckgrdJson.data.location.address,
        zip: bckgrdJson.data.location.zip,
        // Contact
        phone: bckgrdJson.data.contact.phone,
        // Company Stats
        employees: bckgrdJson.data.company_stats.employees,
        founded_year: bckgrdJson.data.company_stats.founded_year,
        ceo: bckgrdJson.data.company_stats.ceo,
        board_members: bckgrdJson.data.company_stats.board_members,
        // Financials
        total_assets: bckgrdJson.data.financials.assets.total_assets,
        total_cash: bckgrdJson.data.financials.assets.total_cash,
        total_debt: bckgrdJson.data.financials.liabilities.total_debt,
        revenue: bckgrdJson.data.financials.performance.revenue,
        gross_profit: bckgrdJson.data.financials.performance.gross_profit,
        operating_cash_flow: bckgrdJson.data.financials.performance.operating_cash_flow,
        free_cash_flow: bckgrdJson.data.financials.performance.free_cash_flow,
        // Metrics
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

      if (!isAiLoading) {
        setIsMainSearchLoading(false);
      }
      return finalData;
    } catch (error) {
      console.error("Stock Data Fetch Error:", error);
      setError("Failed to fetch stock data. Please try again.");
      if (!isAiLoading) {
        setIsMainSearchLoading(false);
      }
      return null;
    }
  };

  // Helper functions
  const parseDate = (dateStr) => {
    const cleanedDateStr = dateStr.replace(/^[A-Za-z]{3},\s/, "");
    const dateObj = new Date(cleanedDateStr);
    if (isNaN(dateObj.getTime())) {
      console.error(`Invalid date: ${dateStr}`);
      return null;
    }
    return dateObj;
  };

  // ========== Watchlist Logic ==========
  const fetchWatchlistStatus = async (stockSymbol) => {
    try {
      const response = await fetch("http://localhost:8080/watchlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }

      const data = await response.json();
      if (data.success) {
        const isStockInWatchlist = data.data.some(
          (item) => item.asset_symbol === stockSymbol
        );
        setIsInWatchlist(isStockInWatchlist);
      } else {
        throw new Error(data.message || "Failed to fetch watchlist");
      }
    } catch (error) {
      console.error("Fetch Watchlist Error:", error);
      setError("Failed to fetch watchlist");
    }
  };

  const toggleWatchlist = async () => {
    if (!stockData?.symbol) {
      setError("No stock selected to add to watchlist");
      return;
    }

    setError("");
    try {
      const method = isInWatchlist ? "DELETE" : "POST";
      const body = isInWatchlist
        ? { asset_symbol: stockData.symbol }
        : { asset_symbol: stockData.symbol, name: stockData.name };

      const response = await fetch("http://localhost:8080/watchlist", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setIsInWatchlist(!isInWatchlist);
      } else {
        setError(data.message || "Failed to update watchlist");
      }
    } catch (error) {
      console.error("Toggle Watchlist Error:", error);
      setError("Failed to connect to the server");
    }
  };

  // ========== AI Chat Logic ==========
  const handleAiSearch = async (userInput) => {
    setIsAiLoading(true);
    setError("");
    try {
      // Step 1: Extract Ticker
      const tickerResponse = await fetch("http://localhost:8080/ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: `Extract the most relevant stock ticker symbol for the company mentioned in this query: "${userInput}". Respond only with "Ticker: [SYMBOL]" where [SYMBOL] is the stock ticker.`,
          current_stock: stockData?.symbol || null,
        }),
      });

      if (!tickerResponse.ok) {
        throw new Error("Failed to fetch AI ticker response");
      }

      const tickerData = await tickerResponse.json();
      const extractedSymbol = extractStockSymbol(tickerData.data);

      if (extractedSymbol) {
        const isValid = await validateStockSymbol(extractedSymbol);
        if (isValid) {
          setSearchQuery(extractedSymbol);
          const stockInfo = await getStockData(extractedSymbol);
          setStockData(stockInfo);
        } else {
          setError(`Invalid or delisted stock symbol: ${extractedSymbol}`);
        }
      }

      // Step 2: Generate detailed AI Response
      const insightsResponse = await fetch("http://localhost:8080/ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: `Provide a detailed response to this query: "${userInput}" for the stock "${stockData?.symbol || 'N/A'}".`,
        }),
      });

      if (!insightsResponse.ok) {
        throw new Error("Failed to fetch AI insights response");
      }

      const insightsData = await insightsResponse.json();
      setAiResponse(insightsData.data);
    } catch (error) {
      console.error("AI Search Error:", error);
      setError("Failed to connect to the AI service.");
    } finally {
      setAiSearchQuery("");
      setIsAiLoading(false);
    }
  };

  const validateStockSymbol = async (symbol) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stock/${symbol}/info`
      );
      return response.ok;
    } catch (error) {
      console.error("Stock Symbol Validation Error:", error);
      return false;
    }
  };

  const extractStockSymbol = (aiText) => {
    const match = aiText.match(/Ticker:\s*([A-Z]{1,5})/);
    return match ? match[1] : null;
  };

  // ========== 4) MetricCard ==========
  const MetricCard = ({ label, value, tooltip }) => (
    <div className="bg-slate-950 p-2 rounded-lg shadow-sm">
      <div className="flex items-center space-x-1 text-xs text-gray-300">
        <span>{label}</span>
        {tooltip && (
          <div className="relative group flex items-center">
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
            <div className="absolute hidden group-hover:block top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-[#0B1120] text-white p-2 rounded-md text-xs shadow-lg z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="text-white font-semibold text-sm mt-1">{value}</div>
    </div>
  );

  // ========== 5) If NO stockData => big center search ==========
  if (!stockData) {
    return (
      <PageWrapper>
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-white text-2xl mb-4">Search for a Stock</h1>
          <div className="relative">
            <input
              type="text"
              textAlign="center"
              style={{ width: "300px", height: "50px", fontSize: "18px" }}
              className="w-full bg-slate-950 text-white px-4 py-2 border border-slate-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         rounded text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={async (evt) => {
                if (evt.key === "Enter") {
                  evt.preventDefault();
                  evt.stopPropagation();
                  await getMainStockData(searchQuery);
                }
              }}
            />
            {isMainSearchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CircularProgress size={24} style={{ color: '#3B82F6' }} />
              </div>
            )}
          </div>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          {message && <p className="mt-2 text-green-500 text-sm">{message}</p>}
        </div>
      </PageWrapper>
    );
  }

  // ========== 6) Full Dashboard ==========
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
        {/* LEFT COLUMN (Search + AI Chat) */}
        <div
          className="flex flex-col h-full border-r border-slate-700 md:p-4"
          style={{ width: `${leftWidth}%`, minWidth: "220px" }}
        >
          {/* Smaller stock search (top) */}
          <div className="bg-slate-950 rounded-xl p-4 mb-4 shadow-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a stock"
                className="w-full bg-slate-900 text-white px-4 py-2 border 
                           border-slate-600 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 
                           rounded text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={async (evt) => {
                  if (evt.key === "Enter") {
                    evt.preventDefault();
                    evt.stopPropagation();
                    await getSmallStockData(searchQuery);
                  }
                }}
              />
              {isSmallSearchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={20} style={{ color: '#3B82F6' }} />
                </div>
              )}
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            {message && (
              <p className="mt-2 text-green-500 text-sm">{message}</p>
            )}
          </div>

          {/* AI Chat box */}
          <div className="bg-slate-950 rounded-xl p-4 flex flex-col h-full shadow-md">
            <div className="mb-4 text-gray-100 font-semibold text-lg">
              AI Chat
            </div>
            {/* Chat log */}
            <div
              className="flex-grow overflow-y-auto p-2 mb-4 
                            rounded-lg text-gray-200 space-y-2"
            >
              <p>
                <strong className="text-gray-100">AI:</strong>{" "}
                {isAiLoading
                  ? "Loading AI response..."
                  : aiResponse || "Ask a question to get AI insights."}
              </p>
            </div>
            {/* Chat input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask me anything"
                className="flex-1 bg-slate-900 text-white px-4 py-2 
                           rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-blue-500"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isMainSearchLoading) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAiSearch(aiSearchQuery);
                  }
                }}
              />
              <button
                onClick={() => handleAiSearch(aiSearchQuery)}
                className={`bg-blue-600 text-white px-4 py-2 
                           rounded-lg hover:bg-blue-700 
                           focus:outline-none focus:ring-2 
                           focus:ring-blue-500 ${
                             isAiLoading ? "opacity-50 cursor-not-allowed" : ""
                           }`}
                disabled={isAiLoading}
              >
                {isAiLoading ? "Loading..." : "Send"}
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
          {/* Stock Header + Toggles + Watchlist */}
          <div className="bg-slate-950 rounded-xl p-4 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-y-2">
              {/* Stock info */}
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

              {/* Toggles */}
              <div className="flex gap-4 items-center">
                <FormControlLabel
                  label={<span style={{ fontSize: "0.8rem" }}>Show Tabs</span>}
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
                  label={<span style={{ fontSize: "0.8rem" }}>Metrics</span>}
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
                  label={<span style={{ fontSize: "0.8rem" }}>Chart</span>}
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

              {/* Watchlist Star */}
              <div>
                <button
                  onClick={toggleWatchlist}
                  className="p-2"
                  title={
                    isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
                  }
                >
                  <i
                    className={`fa${
                      isInWatchlist ? "s" : "r"
                    } fa-star text-yellow-500 text-2xl`}
                  ></i>
                </button>
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
                  value={(parseFloat(stockData.metrics.debtToEquity) / 100).toFixed(2)}
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

          {/* Tabs - in a separate card, blank content */}
          {showTabs && (
            <div className="bg-slate-950 rounded-xl p-4 shadow-md">
              <div className="flex space-x-2 border-b border-slate-600 pb-2 mb-4 justify-center">
                {[
                  "AI Insights",
                  "Company Background"
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
                  <div className="space-y-4">
                    {stockData.aiInsight.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-sm leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                {activeTab === "Company Background" && (
                  <div className="space-y-6">
                    {/* Basic Company Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">Company Overview</h3>
                      <p className="text-sm leading-relaxed">
                        {stockData.name} operates in the {stockData.industry} industry within the {stockData.sector} sector. 
                        Headquartered in {stockData.city}, {stockData.state}, the company is led by CEO {stockData.ceo} and 
                        employs approximately {Number(stockData.employees).toLocaleString()} people.
                      </p>
                    </div>

                    {/* Contact & Location */}
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">Contact & Location</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>Website: <a href={stockData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">{stockData.website}</a></p>
                          <p>Phone: {stockData.phone}</p>
                        </div>
                        <div>
                          <p>Address: {stockData.address}</p>
                          <p>{stockData.city}, {stockData.state} {stockData.zip}</p>
                          <p>{stockData.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Overview */}
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">Financial Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>Total Assets: {stockData.total_assets ? `$${Number(stockData.total_assets).toLocaleString()}` : 'N/A'}</p>
                          <p>Total Cash: {stockData.total_cash ? `$${Number(stockData.total_cash).toLocaleString()}` : 'N/A'}</p>
                          <p>Total Debt: {stockData.total_debt ? `$${Number(stockData.total_debt).toLocaleString()}` : 'N/A'}</p>
                        </div>
                        <div>
                          <p>Revenue: {stockData.revenue ? `$${Number(stockData.revenue).toLocaleString()}` : 'N/A'}</p>
                          <p>Gross Profit: {stockData.gross_profit ? `$${Number(stockData.gross_profit).toLocaleString()}` : 'N/A'}</p>
                          <p>Operating Cash Flow: {stockData.operating_cash_flow ? `$${Number(stockData.operating_cash_flow).toLocaleString()}` : 'N/A'}</p>
                          <p>Free Cash Flow: {stockData.free_cash_flow ? `$${Number(stockData.free_cash_flow).toLocaleString()}` : 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Leadership */}
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">Leadership</h3>
                      <div className="text-sm">
                        <p>CEO: {stockData.ceo || 'N/A'}</p>
                        <p>Board Members: {stockData.board_members || 'N/A'}</p>
                        <p>Total Employees: {stockData.employees ? Number(stockData.employees).toLocaleString() : 'N/A'}</p>
                        <p>Founded: {stockData.founded_year || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
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
