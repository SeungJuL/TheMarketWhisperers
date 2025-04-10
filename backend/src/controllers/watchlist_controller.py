from models.watchlist_model import WatchlistModel
from dtos.response_dto import ResponseUtil

class WatchlistController:
    def __init__(self):
        self.watchlist_model = WatchlistModel()

    def get_watchlists(self, user_id):
        try:
            watchlist_id = self.watchlist_model.get_watchlist_id(user_id)
            items = self.watchlist_model.get_items(watchlist_id)
            return ResponseUtil.success('Watchlists retrieved successfully', [{"name": item[1], "asset_symbol": item[0]} for item in items]), 200
        except Exception as e:
            return ResponseUtil.error('An error occurred while retrieving watchlists', str(e)), 500

    def add_to_watchlist(self, user_id, data):
        try:
            asset_symbol = data.get('asset_symbol')
            name = data.get('name')
            if not name or not asset_symbol:
                return ResponseUtil.failure('Name and asset symbol are required', None), 400
            
            watchlist_id = self.watchlist_model.get_watchlist_id(user_id)
            self.watchlist_model.add_to_watchlist(watchlist_id, name, asset_symbol)
            return ResponseUtil.success('Asset added to watchlist', asset_symbol), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred while adding to watchlist', str(e)), 500

    def remove_from_watchlist(self, user_id, data):
        try:
            asset_symbol = data.get('asset_symbol')
            if not asset_symbol:
                return ResponseUtil.failure('Asset symbol is required', None), 400

            watchlist_id = self.watchlist_model.get_watchlist_id(user_id)
            self.watchlist_model.remove_from_watchlist(watchlist_id, asset_symbol)
            return ResponseUtil.success('Asset removed from watchlist', asset_symbol), 200
        except Exception as e:
            return ResponseUtil.error('An error occurred while removing from watchlist', str(e)), 500