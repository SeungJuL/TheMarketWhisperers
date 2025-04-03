from flask import Blueprint, request
from flask_login import login_required
from controllers.watchlist_controller import Watchlist_Controller

watchlist_blueprint = Blueprint('watchlist', __name__)
watchlist_controller = Watchlist_Controller()

@watchlist_blueprint.route('', methods=['GET'])
@login_required
def get_watchlists():
    return watchlist_controller.get_watchlists()

@watchlist_blueprint.route('', methods=['POST'])
@login_required
def add_to_watchlist():
    return watchlist_controller.add_to_watchlist(request.get_json())

@watchlist_blueprint.route('', methods=['DELETE'])
@login_required
def remove_from_watchlist():
    return watchlist_controller.remove_from_watchlist(request.get_json())