from dtos.response_dto import ResponseUtil
import requests
import os
from dotenv import load_dotenv
import yfinance as yf
load_dotenv()

class StockService:
    def __init__(self):
        self.api_key = os.getenv('STOCK_API_KEY')
        self.base_url = "https://www.alphavantage.co/query"

    def fetch_stock_name(self, keywords):
        try:
            params = {
                "function": "SYMBOL_SEARCH",
                "apikey": self.api_key,
                "keywords": keywords
            }
            
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()
            return data
        
        except requests.exceptions.RequestException as e:
            return ResponseUtil.error("Failed to fetch stock ticker", str(e)), 500
    
    def fetch_stock_data(self, symbol):
        stock = yf.Ticker(symbol)
        return stock 