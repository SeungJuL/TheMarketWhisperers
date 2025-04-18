from services.stock_service import StockService
from dtos.response_dto import ResponseUtil

class StockController:
    def __init__(self):
        self.stock_service = StockService()

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
        
    def company_background(self, symbol):
        try:
            stock = self.stock_service.fetch_stock_data(symbol)
            info = stock.info
            
            data = {
                "basic_info": {
                    "symbol": symbol,
                    "name": info.get("longName"),
                    "sector": info.get("sector"),
                    "industry": info.get("industry"),
                    "website": info.get("website")
                },
                "location": {
                    "country": info.get("country"),
                    "city": info.get("city"),
                    "state": info.get("state"),
                    "address": info.get("address1"),
                    "zip": info.get("zip")
                },
                "contact": {
                    "phone": info.get("phone")
                },
                "company_stats": {
                    "employees": info.get("fullTimeEmployees"),
                    "founded_year": info.get("foundedYear"),
                    "ceo": info.get("companyOfficers", [{}])[0].get("name") if info.get("companyOfficers") else None,
                    "board_members": len(info.get("companyOfficers", [])) if info.get("companyOfficers") else 0
                },
                "financials": {
                    "assets": {
                        "total_assets": info.get("totalAssets"),
                        "total_cash": info.get("totalCash")
                    },
                    "liabilities": {
                        "total_debt": info.get("totalDebt")
                    },
                    "performance": {
                        "revenue": info.get("totalRevenue"),
                        "gross_profit": info.get("grossProfits"),
                        "operating_cash_flow": info.get("operatingCashflow"),
                        "free_cash_flow": info.get("freeCashflow")
                    }
                }
            }
            
            return ResponseUtil.success("Success getting company background information", data), 201
            
        except Exception as e:
            return ResponseUtil.error('An error occurred during getting company background information', str(e)), 500
        
        