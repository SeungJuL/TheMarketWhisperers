from util.stock_api import fetch_stock_name, fetch_stock_data
from dto.response_dto import ResponseUtil

class Stock:
    @staticmethod
    def stock_search(stock_name):
        try:
            stock_datas = fetch_stock_name(stock_name)
            matched_stocks = stock_datas['bestMatches']
            return ResponseUtil.success("Success getting stock datas", matched_stocks), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred during searching stocks', str(e)), 500
        
    @staticmethod
    def stock_price(symbol):
        try:
            stock = fetch_stock_data(symbol)
            price = stock.history(period="1d")["Close"].iloc[-1]
            return ResponseUtil.success("Success getting stock recent price", {"symbol": symbol, "price": price}), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred during getting stock datas', str(e)), 500
        
    @staticmethod
    def stock_history(symbol, period, interval):
        try:
            stock = fetch_stock_data(symbol)
            history = stock.history(period=period, interval=interval)
            data = history.reset_index().to_dict(orient="records")
            return ResponseUtil.success("Success getting historical stock data", data), 201
        
        except Exception as e:
            return ResponseUtil.error('An error occurred during getting historical stock datas', str(e)), 500
        
    @staticmethod
    def stock_info(symbol):
        try:
            stock = fetch_stock_data(symbol)
            info = stock.info
            return ResponseUtil.success("Success getting stock informations", 
                {
                "symbol": symbol,
                "PER": info.get("trailingPE"),
                "EPS": info.get("trailingEps"),
                "dividend_yield": info.get("dividendYield"),
                "dividend_date": info.get("exDividendDate")
                }), 201
        
        except Exception as e:
            return ResponseUtil.error('An error occurred during getting stock informations', str(e)), 500
        