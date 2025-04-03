from services.ai_service import AIService
from dtos.response_dto import ResponseUtil

class AI:
    def __init__(self):
        self.ai_service = AIService()

    def get_response(self, data):
        try: 
            ai_response = self.ai_service.get_financial_insight(data.get('user_message'))
            return ResponseUtil.success("Success getting response from chatgpt", ai_response), 201
        
        except Exception as e:
            return ResponseUtil.error('An error occurred during connecting open ai', str(e)), 500


        
