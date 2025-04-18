from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

class AIService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('GPT_API_KEY'))

    def get_financial_insight(self, prompt):
        # Create Chat Completion for structured financial analysis
        chat_completion = self.client.chat.completions.create(
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a financial analyst providing structured stock analysis. "
                        "Provide analysis in the following format:\n\n"
                        "COMPANY OVERVIEW:\n"
                        "- Point 1\n"
                        "- Point 2\n\n"
                        "RECENT PERFORMANCE:\n"
                        "- Point 1\n"
                        "- Point 2\n\n"
                        "KEY METRICS:\n"
                        "- Point 1\n"
                        "- Point 2\n\n"
                        "MARKET POSITION:\n"
                        "- Point 1\n"
                        "- Point 2\n\n"
                        "FUTURE OUTLOOK:\n"
                        "- Point 1\n"
                        "- Point 2\n"
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model = "gpt-3.5-turbo"
        )

        response = chat_completion.choices[0].message.content
        return response

    def get_chat_response(self, prompt):
        # Create Chat Completion for conversational responses
        chat_completion = self.client.chat.completions.create(
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a helpful AI assistant specialized in finance and stock market analysis. "
                        "Provide clear, conversational responses to user questions about stocks and investments. "
                        "Use real examples and explain concepts in a beginner-friendly way."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model = "gpt-3.5-turbo"
        )

        response = chat_completion.choices[0].message.content
        return response 