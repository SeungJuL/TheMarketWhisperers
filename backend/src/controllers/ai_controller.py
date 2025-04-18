from services.ai_service import AIService
from services.stock_service import StockService
from dtos.response_dto import ResponseUtil

class AIController:
    def __init__(self):
        self.ai_service = AIService()
        self.stock_service = StockService()

    def get_response(self, data):
        try: 
            ai_response = self.ai_service.get_chat_response(data.get('user_message'))
            return ResponseUtil.success("Success getting response from chatgpt", ai_response), 201
        
        except Exception as e:
            return ResponseUtil.error('An error occurred during connecting open ai', str(e)), 500
    
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


        
