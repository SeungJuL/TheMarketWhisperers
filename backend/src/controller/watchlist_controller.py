from flask import jsonify
from flask_login import current_user
from model.watchlist_model import Watchlist_Model
from dto.response_dto import ResponseUtil

class Watchlist_Controller:
    @staticmethod
    def get_watchlists():
        try:
            user_id = current_user.id
            watchlists = Watchlist_Model.find_by_user_id(user_id)
            return ResponseUtil.success('Watchlists retrieved successfully', [{"name": item[2], "asset_symbol": item[3]} for item in watchlists]), 200
        except Exception as e:
            return ResponseUtil.error('An error occurred while retrieving watchlists', str(e)), 500

    @staticmethod
    def add_to_watchlist(data):
        try:
            user_id = current_user.id
            name = data.get('name')
            asset_symbol = data.get('asset_symbol')
            if not name or not asset_symbol:
                return ResponseUtil.failure('Name and asset symbol are required', None), 400

            Watchlist_Model.add_to_watchlist(user_id, name, asset_symbol)
            return ResponseUtil.success('Asset added to watchlist', None), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred while adding to watchlist', str(e)), 500

    @staticmethod
    def remove_from_watchlist(data):
        try:
            user_id = current_user.id
            name = data.get('name')
            asset_symbol = data.get('asset_symbol')
            if not name or not asset_symbol:
                return ResponseUtil.failure('Name and asset symbol are required', None), 400

            Watchlist_Model.remove_from_watchlist(user_id, name, asset_symbol)
            return ResponseUtil.success('Asset removed from watchlist', None), 200
        except Exception as e:
            return ResponseUtil.error('An error occurred while removing from watchlist', str(e)), 500