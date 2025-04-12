from db.psql import conn_psql

class WatchlistModel:
    def create_watchlist(self, user_id):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "INSERT INTO watchlists(user_id) VALUES(%s)"
        db_cursor.execute(sql, (user_id,))
        psql_db.commit()

    def get_watchlist_id(self, user_id):
        # get watchlist id
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "SELECT * FROM watchlists WHERE user_id = %s"
        db_cursor.execute(sql, (user_id,))
        watchlist = db_cursor.fetchone()
        watchlist_id = watchlist[0]
        return watchlist_id

    def get_items(self, watchlist_id):
        # get watchlist items
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "SELECT asset_symbol, name FROM watchlist_items WHERE watchlist_id = %s"
        db_cursor.execute(sql, (watchlist_id,))
        items = db_cursor.fetchall()
        return items

    def add_to_watchlist(self, watchlist_id, name, asset_symbol):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "INSERT INTO watchlist_items(watchlist_id, name, asset_symbol) VALUES(%s, %s, %s)"
        db_cursor.execute(sql, (watchlist_id, name, asset_symbol))
        psql_db.commit()
    
    def remove_from_watchlist(self, watchlist_id, asset_symbol):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "DELETE FROM watchlist_items WHERE watchlist_id = %s AND asset_symbol = %s"
        db_cursor.execute(sql, (watchlist_id, asset_symbol))
        psql_db.commit()