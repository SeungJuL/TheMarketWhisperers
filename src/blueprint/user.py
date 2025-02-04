from flask import Blueprint
from controller.user_controller import User
user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/register', methods=['POST'])
def register():
    return User.register()

@user_blueprint.route('/login', methods=['POST'])
def login():
    return User.login()