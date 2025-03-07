from flask import Blueprint, request
from controller.ai_controller import AI

ai_blueprint = Blueprint('ai', __name__)

@ai_blueprint.route('/', methods=['POST'])
def search():
    return AI.get_response(request.get_json())