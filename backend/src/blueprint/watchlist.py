from flask import Blueprint, request
from flask_login import login_required
from controller.watchlist_controller import Watchlist_Controller

watchlist_blueprint = Blueprint('watchlist', __name__)

@watchlist_blueprint.route('', methods=['GET'])
@login_required
def get_watchlists():
    return Watchlist_Controller.get_watchlists()

@watchlist_blueprint.route('', methods=['POST'])
@login_required
def add_to_watchlist():
    return Watchlist_Controller.add_to_watchlist(request.get_json())

@watchlist_blueprint.route('', methods=['DELETE'])
@login_required
def remove_from_watchlist():
    return Watchlist_Controller.remove_from_watchlist(request.get_json())