from flask import Blueprint, request
from controllers.ai_controller import AIController

ai_blueprint = Blueprint('ai', __name__)
ai_controller = AIController()

@ai_blueprint.route('/', methods=['POST'])
def search():
    return ai_controller.get_response(request.get_json())

@ai_blueprint.route("/insight/<symbol>", methods=["GET"])
def get_stock_insight(symbol):
    return ai_controller.get_stock_insight(symbol)