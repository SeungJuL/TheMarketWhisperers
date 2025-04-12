from flask import Blueprint, request, jsonify, make_response
from controllers.watchlist_controller import WatchlistController
import jwt
import os
from functools import wraps  # Import wraps

watchlist_blueprint = Blueprint('watchlist', __name__)
watchlist_controller = WatchlistController()

def jwt_required(func):
    @wraps(func)  # Preserve the original function name
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_response(jsonify(success=False, message="Missing or invalid token"), 401)
        
        token = auth_header.split(' ')[1]
        try:
            decoded_token = jwt.decode(token, os.getenv('SESSION_SECRET_KEY'), algorithms=["HS256"])
            user_id = decoded_token.get('user_id')
            if not user_id:
                raise jwt.InvalidTokenError
            request.user_id = user_id  # Attach user_id to the request
            return func(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return make_response(jsonify(success=False, message="Token expired"), 401)
        except jwt.InvalidTokenError:
            return make_response(jsonify(success=False, message="Invalid token"), 401)
    return wrapper

@watchlist_blueprint.route('', methods=['GET'])
@jwt_required
def get_watchlists():
    return watchlist_controller.get_watchlists(request.user_id)

@watchlist_blueprint.route('', methods=['POST'])
@jwt_required
def add_to_watchlist():
    return watchlist_controller.add_to_watchlist(request.user_id, request.get_json())

@watchlist_blueprint.route('', methods=['DELETE'])
@jwt_required
def remove_from_watchlist():
    return watchlist_controller.remove_from_watchlist(request.user_id, request.get_json())