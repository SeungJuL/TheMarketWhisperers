from flask import Blueprint, request
from flask_login import login_required
from controllers.user_controller import UserController

user_blueprint = Blueprint('user', __name__)
user_controller = UserController()

@user_blueprint.route('/register', methods=['POST'])
def register():
    return user_controller.register(request.get_json())

@user_blueprint.route('/login', methods=['POST'])
def login():
    return user_controller.login(request.get_json())

@user_blueprint.route('/profile', methods=['GET'])
@login_required
def profile():
    return user_controller.profile()
