import { useState } from "react";
import StockCard from "../components/StockCard";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [stock, setStock] = useState(null);

  const fetchStock = async () => {
    const response = await fetch(`http://127.0.0.1:8080/stocks/${search}`);
    const data = await response.json();
    setStock(data);
  };

  return (
    <div className="container">
      <h1>📈 Stock Market Dashboard</h1>
      <input
        type="text"
        placeholder="Enter stock symbol (e.g., AAPL)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={fetchStock}>Search</button>

      {stock && <StockCard stock={stock} />}
    </div>
  );
};

export default HomePage;
