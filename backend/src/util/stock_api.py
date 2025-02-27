from dto.response_dto import ResponseUtil
import requests
import os
from dotenv import load_dotenv
import yfinance as yf
load_dotenv()

def fetch_stock_name(keywords):
    try:
        api_key = os.getenv('STOCK_API_KEY')
        base_url = "https://www.alphavantage.co/query"
        params = {
            "function": "SYMBOL_SEARCH",
            "apikey": api_key,
            "keywords": keywords
        }
        
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        return data
    
    except requests.exceptions.RequestException as e:
        return ResponseUtil.error("Failed to fetch stock ticker", str(e)), 500
    
def fetch_stock_data(symbol):
    stock = yf.Ticker(symbol)
    return stock