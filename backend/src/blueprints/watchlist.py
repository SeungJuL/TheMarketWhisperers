from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from controllers.watchlist_controller import WatchlistController

watchlist_blueprint = Blueprint('watchlist', __name__)
watchlist_controller = WatchlistController()

@watchlist_blueprint.route('/', methods=['GET'])
@login_required
def get_watchlist():
    return watchlist_controller.get_watchlists()  # Removed unnecessary argument

@watchlist_blueprint.route('/', methods=['POST'])
@login_required
def add_to_watchlist():
    data = request.get_json()
    return watchlist_controller.add_to_watchlist(current_user.id, data)

@watchlist_blueprint.route('/', methods=['DELETE'])
@login_required
def remove_from_watchlist():
    data = request.get_json()
    return watchlist_controller.remove_from_watchlist(current_user.id, data)