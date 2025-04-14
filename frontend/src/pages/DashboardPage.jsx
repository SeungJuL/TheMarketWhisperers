import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import PageWrapper from '../components/PageWrapper';
import StockChart from "../components/StockChart";
import { fetchWatchlist } from "../utils/userUtils"; // Import fetchWatchlist

const DashboardPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('AI Insights');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState(null); // Updated to store stock data
  const [isVisible, setIsVisible] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (stockData?.symbol) {
      fetchWatchlistStatus(stockData.symbol);
    }
  }, [stockData]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stock = params.get("stock");
    if (stock) {
      setSearchQuery(stock);
      getStockData(stock).then((val) => { setStockData(val) });
    }
  }, [location]);

  const fetchWatchlistStatus = async (stockSymbol) => {
    try {
      const response = await fetch("/watchlist", {
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

      const response = await fetch("/watchlist", {
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

  // Function to clean and parse dates
  const parseDate = (dateStr) => {
    // Strip out the weekday name (e.g., 'Thu,' or 'Mon,')
    const cleanedDateStr = dateStr.replace(/^[A-Za-z]{3},\s/, '');

    // Debugging
    //console.log('Cleaned data/: $(cleanedDataStr');

    const dateObj = new Date(cleanedDateStr);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error(`Invalid date: ${dateStr}`);
      return null; // Return null if invalid
    }

    return dateObj;
  };

  const getStockData = async (stockName) => {

    setError("");

    try {
      const response = await fetch("http://localhost:8080/stock/search?stock_name=" + stockName, {
        method: "GET"
      });

      const stocks = await response.json();
      //console.log("API Response:", stocks);

      if (stocks.success) {

        //console.log("GOT:" + stocks.data[0]['1. symbol']);  // ✅ Show success message

        // Stock price
        const price_response = await fetch("http://localhost:8080/stock/" + stocks.data[0]['1. symbol'] + "/price?asset_symbol=" + stocks.data[0]['1. symbol'], {
          method: "GET"
        });

        // Stock metrics
        const si_response = await fetch("http://localhost:8080/stock/" + stocks.data[0]['1. symbol'] + "/info", {
          method: "GET"
        });

        // Historical data 
        const hist_response = await fetch("http://localhost:8080/stock/" + stocks.data[0]['1. symbol'] + "/history", {
          method: "GET"
        });
        
        const price = await price_response.json();
        //console.log("Price API Response:", price);

        const stockInfo = await si_response.json();
        //console.log("Stock Info API Response:", stockInfo);

        const historicalInfo = await hist_response.json();
        //console.log("Historial Data API Response:", historicalInfo);

        // Use length - 2 to get latest Close price
        const closeVal = historicalInfo.data[Object.keys(historicalInfo.data).length - 2]['Close'];

        // Extract dates and close values for chart
        const rawDates = historicalInfo.data.map(item => item.Date);
        const chartLabels = [];
        const chartClose = [];
        const chartHighs = [];
        const chartLows = [];

        for (let i = 0; i < rawDates.length - 1; i++) {
          const dateStr = rawDates[i];

          // Use the parseDate function to clean and parse the date
          const dateObj = parseDate(dateStr);

          if (!dateObj) continue; // Skip if date is invalid

          // Format the date as "Month Day" (e.g., "March 10")
          const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', timeZone: 'UTC' }).format(dateObj);
          
          chartLabels.push(formattedDate);
          chartClose.push(historicalInfo.data[i]['Close']);
          chartHighs.push(historicalInfo.data[i]['High']);
          chartLows.push(historicalInfo.data[i]['Low']);
        }

        const calcChange = (((price.data['price'] - closeVal) / closeVal) * 100);

        // Converts large numbers to K, M, B, and T format for market cap readability
        const formattedMarketCap = new Intl.NumberFormat('en-US', {
          notation: 'compact',
          compactDisplay: 'short',
        }).format(stockInfo.data['market_cap']);

        // Update stockData
         const stockData = {
          name: stocks.data[0]['2. name'],
          symbol: stocks.data[0]['1. symbol'],
          price: price.data['price'],
          change: calcChange,
          chartLabels,
          chartClose,
          chartHighs,
          chartLows,
          metrics: {
            weekHigh: stockInfo.data['52_week_high'],
            weekLow: stockInfo.data['52_week_low'],
            eps: stockInfo.data['eps'],
            revenueGrowth: (stockInfo.data['revenue_growth'] * 100),
            marketCap: formattedMarketCap,
            volume: stockInfo.data['volume'],
            avgVolume: stockInfo.data['average_volume'],
            dividendYield: stockInfo.data['dividend_yield'],
            beta: stockInfo.data['beta'],
            debtToEquity: stockInfo.data['debt_to_equity'],
            peRatio: stockInfo.data['pe_ratio'],
          }}
        
          setIsVisible(true); // Display Stock Header, Metrics Data, & Stock Chart
          return stockData;

      } else {
        setError(`Fetch stock failed! ${stocks.message}`);  // ✅ Show error message
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to connect to the server.");
    }
  };

  const MetricCard = ({ label, value, tooltip }) => (
    <div className="bg-slate-700 p-3 rounded-lg relative group ">
      <div className="flex items-center mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        {tooltip && (
          <div className="ml-2">
            <span className="text-slate-400 cursor-help">ⓘ</span>
            <div className="absolute hidden group-hover:block bg-slate-800 text-white p-2 rounded-md text-sm w-48">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="text-white font-semibold">{value}</div>
    </div>
  );

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center flex-grow px-4 md:px-8 mt-20 mb-20">
      
        {/* Top Navigation */}
        <div className="bg-transparent p-4 flex items-center justify-center z-40">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a stock"
              className="bg-slate-800 text-white px-6 py-3 border-b-2 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg hover:border-blue-400 transition-all duration-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(evt) => { if (evt.key === 'Enter') { 
                  
                  getStockData(searchQuery).then((val) => { setStockData(val) });
               }}}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-4">

          <div>
            {/* Stock Header */}
            {isVisible &&             
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{stockData.name} ({stockData.symbol})</h1>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">${parseFloat(stockData.price).toFixed(2)}</span>
                    <span className={stockData.change >= 0 ? "text-green-500" : "text-red-500"}>({parseFloat(stockData.change).toFixed(2)}%)</span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={toggleWatchlist}
                    className="absolute top-0 right-0 p-2"
                    title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  >
                    <i
                      className={`fa${isInWatchlist ? "s" : "r"} fa-star text-yellow-500 text-2xl`}
                    ></i>
                  </button>
                </div>
                {error && <div className="text-red-500">{error}</div>}
              </div>}

            {/* Metrics Grid */}
            {isVisible &&
              <div className="flex flex-col md:flex-row gap-6 mb-6 w-full">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:w-1/2">
                  <MetricCard
                    label="52 Week High/Low"
                    value={parseFloat(stockData.metrics.weekHigh).toFixed(2) + ' / ' + parseFloat(stockData.metrics.weekLow).toFixed(2)}
                    tooltip="The highest and lowest stock price over the past 52 weeks"
                  />
                  <MetricCard
                    label="Earnings Per Share"
                    value={stockData.metrics.eps}
                    tooltip="Company's profit divided by outstanding shares"
                  />
                  <MetricCard
                    label="Revenue Growth"
                    value={parseFloat(stockData.metrics.revenueGrowth).toFixed(2) + '%'}
                    tooltip="Year-over-year revenue growth percentage"
                  />
                  <MetricCard
                    label="Market Cap"
                    value={stockData.metrics.marketCap}
                    tooltip="Total market value of company's outstanding shares"
                  />
                  <MetricCard
                    label="Volume/Average Volume"
                    value={`${Number(stockData.metrics.volume).toLocaleString()} / ${Number(stockData.metrics.avgVolume).toLocaleString()}`}
                    tooltip="Today's trading volume vs 3-month average"
                  />
                  <MetricCard
                    label="Dividend Yield"
                    value={stockData.metrics.dividendYield}
                    tooltip="Annual dividend payments relative to stock price"
                  />
                  <MetricCard
                    label="Beta"
                    value={parseFloat(stockData.metrics.beta).toFixed(2)}
                    tooltip="Stock's volatility compared to the market"
                  />
                  <MetricCard
                    label="Debt-to-Equity Ratio"
                    value={parseFloat(stockData.metrics.debtToEquity).toFixed(2)}
                    tooltip="Total liabilities divided by shareholder equity"
                  />
                  <MetricCard
                    label="P/E Ratio"
                    value={parseFloat(stockData.metrics.peRatio).toFixed(2)}
                    tooltip="Stock price relative to earnings per share"
                  />
                </div>

                {/* Stock Chart */}
                <div className="md:w-1/2 flex justify-center items-center">
                  <StockChart historicalInfo={stockData} />
                </div>
              </div>}          
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-600 mb-4">
            <div className="flex space-x-4">
              {['AI Insights', 'Company Background', 'Fundamentals', 'Technicals'].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 ${
                    activeTab === tab
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-slate-700 rounded-lg p-6 mb-6">
            {activeTab === 'AI Insights' && (
              <div>
                {/* TODO: Replace with actual AI insights */}
                <p className="text-slate-300">
                  Apple Inc. (AAPL) remains a strong long-term investment due to its market-leading position, consistent
                  revenue streams from hardware and services, and robust financial health with a market cap of over $3
                  trillion. While the stock has recently faced challenges, including slowing iPhone sales and competition in
                  China, its diversified product ecosystem, high customer loyalty, and strong cash flow provide resilience.
                  However, with a relatively high P/E ratio around 36.59, the stock is priced for growth, which could be risky if
                  innovation slows or market dynamics worsen. For investors, Apple offers stability and long-term potential
                  but may not be a bargain at current valuations. Assess your risk tolerance and investment goals before
                  committing.
                </p>
              </div>
            )}
            {/* Other tab contents will be implemented similarly */}
          </div>

          {/* Ask AI Section */}
          <div className="fixed bottom-4 left-4 right-4 bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask me anything"
                className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;