import React, { useEffect, useRef, useState } from 'react';
import { EyeIcon, HomeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import PageWrapper from '../components/PageWrapper';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  const chartContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('AI Insights');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for initial display
  const stockData = {
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: '222.46',
    change: '-0.60',
    metrics: {
      weekHighLow: '166.00 / 260.10',
      eps: '6.06',
      revenueGrowth: '2.02%',
      marketCap: '3.345T',
      volume: '40,521,968',
      avgVolume: '47,734,813',
      dividendYield: '0.45%',
      beta: '1.24',
      debtToEquity: '1.51',
      peRatio: '36.59'
    }
  };

  const MetricCard = ({ label, value, tooltip }) => (
    <div className="bg-slate-700 p-4 rounded-lg relative group">
      <div className="flex items-center mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        {tooltip && (
          <div className="ml-2">
            <span className="text-slate-400 cursor-help">ⓘ</span>
            <div className="absolute hidden group-hover:block bg-slate-800 text-white p-2 rounded-md text-sm z-10 w-48">
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
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow px-4 md:px-8 mt-16">
        {/* Top Navigation */}
        <div className="bg-transparent p-4 flex items-center justify-center z-40">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a stock"
              className="bg-slate-800 text-white px-6 py-3 border-b-2 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg hover:border-blue-400 transition-all duration-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-4">
          {/* Stock Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{stockData.name} ({stockData.symbol})</h1>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">${stockData.price}</span>
                <span className="text-red-500">({stockData.change}%)</span>
              </div>
            </div>
            <button className="text-yellow-500">★</button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              tooltip="Today's trading volume vs 3-month average"
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
              label="Debt-to-Equity Ratio"
              value={stockData.metrics.debtToEquity}
              tooltip="Total liabilities divided by shareholder equity"
            />
            <MetricCard
              label="P/E Ratio"
              value={stockData.metrics.peRatio}
              tooltip="Stock price relative to earnings per share"
            />
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