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
