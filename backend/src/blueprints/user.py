from flask import Blueprint, request, jsonify
from flask_login import login_required, logout_user
from controllers.user_controller import UserController
from dtos.response_dto import ResponseUtil

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
def get_profile():
    return user_controller.get_profile()

@user_blueprint.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    return user_controller.update_profile(request.get_json())

@user_blueprint.route('/profile/picture', methods=['PUT'])
@login_required
def update_profile_picture():
    return user_controller.update_profile_picture()

@user_blueprint.route('/password', methods=['PUT'])
@login_required
def update_password():
    return user_controller.change_password(request.get_json())

@user_blueprint.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return ResponseUtil.success("Logged out successfully", None), 200