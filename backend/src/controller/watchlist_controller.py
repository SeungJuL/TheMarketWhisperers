from flask_login import current_user
from model.watchlist_model import Watchlist_Model
from dto.response_dto import ResponseUtil

class Watchlist_Controller:
    @staticmethod
    def get_watchlists():
        try:
            user_id = current_user.id
            watchlist_id = Watchlist_Model.get_watchlist_id(user_id)
            items = Watchlist_Model.get_items(watchlist_id)
            return ResponseUtil.success('Watchlists retrieved successfully', [{"name": item[1], "asset_symbol": item[0]} for item in items]), 200
        except Exception as e:
            return ResponseUtil.error('An error occurred while retrieving watchlists', str(e)), 500

    @staticmethod
    def add_to_watchlist(data):
        try:
            user_id = current_user.id
            asset_symbol = data.get('asset_symbol')
            name = data.get('name')
            # if asset symbol or name is not given
            if not name or not asset_symbol:
                return ResponseUtil.failure('Name and asset symbol are required', None), 400
            
            watchlist_id = Watchlist_Model.get_watchlist_id(user_id)
            Watchlist_Model.add_to_watchlist(watchlist_id, asset_symbol, name)

            return ResponseUtil.success('Asset added to watchlist', asset_symbol), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred while adding to watchlist', str(e)), 500

    @staticmethod
    def remove_from_watchlist(data):
        try:
            user_id = current_user.id
            asset_symbol = data.get('asset_symbol')
            # if symbol is not given
            if not asset_symbol:
                return ResponseUtil.failure('Asset symbol are required', None), 400

            watchlist_id = Watchlist_Model.get_watchlist_id(user_id)
            Watchlist_Model.remove_from_watchlist(watchlist_id, asset_symbol)
            return ResponseUtil.success('Asset removed from watchlist', asset_symbol), 200
        except Exception as e:
            return ResponseUtil.error('An error occurred while removing from watchlist', str(e)), 500