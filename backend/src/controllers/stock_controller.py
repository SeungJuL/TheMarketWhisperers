from services.stock_service import StockService
from services.ai_service import AIService
from dtos.response_dto import ResponseUtil

class StockController:
    def __init__(self):
        self.stock_service = StockService()
        self.ai_service = AIService()

    def symbol_search(self, stock_name):
        try:
            stock_datas = self.stock_service.fetch_stock_name(stock_name)
            matched_stocks = stock_datas['bestMatches']
            return ResponseUtil.success("Success getting stock datas", matched_stocks), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred during searching stocks', str(e)), 500
        
    def current_price(self, symbol):
        try:
            stock = self.stock_service.fetch_stock_data(symbol)
            price = stock.history(period="1d")["Close"].iloc[-1]
            return ResponseUtil.success("Success getting stock recent price", {"symbol": symbol, "price": price}), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred during getting stock datas', str(e)), 500
        
    def stock_history(self, symbol, period, interval):
        try:
            stock = self.stock_service.fetch_stock_data(symbol)
            history = stock.history(period=period, interval=interval)
            data = history.reset_index().to_dict(orient="records")
            return ResponseUtil.success("Success getting historical stock data", data), 201
        
        except Exception as e:
            return ResponseUtil.error('An error occurred during getting historical stock datas', str(e)), 500
        
    def company_info(self, symbol):
        try:
            stock = self.stock_service.fetch_stock_data(symbol)
            info = stock.info
            fast_info = stock.fast_info
            data = {
                "symbol": symbol,
                "52_week_high": fast_info.get("yearHigh"),
                "52_week_low": fast_info.get("yearLow"),
                "market_cap": info.get("marketCap"),
                "beta": info.get("beta"), 
                "eps": info.get("trailingEps"), 
                "volume": fast_info.get("lastVolume"),  
                "average_volume": info.get("averageVolume"),
                "debt_to_equity": info.get("debtToEquity"),
                "revenue_growth": info.get("revenueGrowth"),
                "dividend_yield": info.get("dividendYield"),
                "pe_ratio": info.get("trailingPE")
            }           
            return ResponseUtil.success("Success getting stock informations", data), 201
        
        except Exception as e:
            return ResponseUtil.error('An error occurred during getting stock informations', str(e)), 500
        
    def get_stock_insight(self, symbol):
        try:
            stock = self.stock_service.fetch_stock_data(symbol)
            info = stock.info
            
            # Create prompt for AI
            prompt = f"""
            Please provide a comprehensive analysis of {symbol} ({info.get('longName', '')}).
            Include:
            1. Company overview
            2. Recent performance
            3. Key financial metrics
            4. Market position
            5. Future outlook
            
            Current price: ${stock.history(period="1d")["Close"].iloc[-1]}
            Market cap: ${info.get('marketCap', 'N/A')}
            P/E ratio: {info.get('trailingPE', 'N/A')}
            """
            
            insight = self.ai_service.get_financial_insight(prompt)
            return ResponseUtil.success("Success getting AI insight", insight), 201
            
        except Exception as e:
            return ResponseUtil.error('An error occurred during getting AI insight', str(e)), 500
        