from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from controller.user_controller import User

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/register', methods=['POST'])
def register():
    return User.register(request.get_json())

@user_blueprint.route('/login', methods=['POST'])
def login():
    return User.login(request.get_json())

@user_blueprint.route('/profile', methods=['GET'])
@login_required
def profile():
    return User.profile(request.args.get('email'))
