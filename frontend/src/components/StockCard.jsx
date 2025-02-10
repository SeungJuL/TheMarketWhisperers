const StockCard = ({ stock }) => {
    return (
      <div className="stock-card">
        <h2>{stock.name} ({stock.symbol})</h2>
        <p>Price: ${stock.price}</p>
        <p>Change: {stock.change}%</p>
        <p>Market Cap: {stock.market_cap}</p>
        <p>P/E Ratio: {stock.pe_ratio}</p>
      </div>
    );
  };
  
  export default StockCard;
  