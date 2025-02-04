from flask import jsonify
from dto.response_dto import ResponseUtil
import requests
import os

def fetch_stock_data(func, symbol=None, keywords=None, interval=None):
    try:
        api_key = os.getenv('STOCK_API_KEY')
        base_url = "https://www.alphavantage.co/query"
        
        params = {
            "function": func,
            "apikey": api_key,
        }
        if symbol:
            params["symbol"] = symbol
        if keywords:
            params["keywords"] = keywords
        if interval:
            params["interval"] = interval

        response = requests.get('base_url', params=params)
        response.raise_for_status()
        return response.json()
    
    except Exception as e:
            return ResponseUtil.error('An error occurred during login', str(e)), 500

        