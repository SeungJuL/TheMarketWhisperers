from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from controller.user_controller import User

user_blueprint = Blueprint('user', __name__, url_prefix='/user')

@user_blueprint.route('/register', methods=['POST'])
def register():
    return User.register()

@user_blueprint.route('/login', methods=['POST'])
def login():
    return User.login()

# ✅ Add this route for user profile
@user_blueprint.route('/profile', methods=['GET'])
@login_required
def profile():
    user = current_user
    if user.is_authenticated:
        return jsonify({"success": True, "message": "Profile retrieved", "user": {
            "email": user.user_email,
            "id": user.id
        }})
    return jsonify({"success": False, "message": "Unauthorized"}), 401
