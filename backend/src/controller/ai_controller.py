from util.openai import get_financial_insight
from dto.response_dto import ResponseUtil

class AI:
    @staticmethod
    def get_response(data):
        try: 
            ai_response = get_financial_insight(data.get('user_message'))
            return ResponseUtil.success("Success getting response from chatgpt", ai_response), 201
        
        except Exception as e:
            return ResponseUtil.error('An error occurred during connecting open ai', str(e)), 500


        
