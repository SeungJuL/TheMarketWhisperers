from flask import Blueprint, request
from controllers.ai_controller import AI

ai_blueprint = Blueprint('ai', __name__)
ai_controller = AI()

@ai_blueprint.route('/', methods=['POST'])
def search():
    return ai_controller.get_response(request.get_json())