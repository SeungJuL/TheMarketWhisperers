from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

class AIService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('GPT_API_KEY'))

    def get_financial_insight(self, prompt):
        # Create Chat Completion
        chat_completion = self.client.chat.completions.create(
            messages = [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model = "gpt-3.5-turbo"
        )

        response = chat_completion.choices[0].message.content
        return response 