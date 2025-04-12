from flask import Blueprint, request, jsonify, make_response
from controllers.user_controller import UserController
import jwt
import os
from functools import wraps

user_blueprint = Blueprint('user', __name__)
user_controller = UserController()

def jwt_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        print("Authorization Header:", auth_header)  # Debugging

        if not auth_header or not auth_header.startswith('Bearer '):
            print("Missing or invalid token")  # Debugging
            return make_response(jsonify(success=False, message="Missing or invalid token"), 401)
        
        token = auth_header.split(' ')[1]
        try:
            decoded_token = jwt.decode(token, os.getenv('SESSION_SECRET_KEY'), algorithms=["HS256"])
            print("Decoded Token:", decoded_token)  # Debugging
            user_id = decoded_token.get('user_id')
            if not user_id:
                print("User ID missing in token")  # Debugging
                raise jwt.InvalidTokenError
            request.user_id = user_id  # Attach user_id to the request
            return func(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            print("Token expired")  # Debugging
            return make_response(jsonify(success=False, message="Token expired"), 401)
        except jwt.InvalidTokenError:
            print("Invalid token")  # Debugging
            return make_response(jsonify(success=False, message="Invalid token"), 401)
    return wrapper

@user_blueprint.route('/register', methods=['POST'])
def register():
    return user_controller.register(request.get_json())

@user_blueprint.route('/login', methods=['POST'])
def login():
    return user_controller.login(request.get_json())

@user_blueprint.route('/profile', methods=['GET'])
@jwt_required
def profile():
    return user_controller.profile()
