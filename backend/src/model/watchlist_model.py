from db.psql import conn_psql

class Watchlist_Model:
    @staticmethod
    def find_by_user_id(user_id):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "SELECT * FROM watchlists WHERE user_id = %s"
        db_cursor.execute(sql, (user_id,))
        watchlists = db_cursor.fetchall()
        return watchlists
    
    @staticmethod
    def add_to_watchlist(user_id, name, asset_symbol):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "INSERT INTO watchlists(user_id, name, asset_symbol) VALUES(%s, %s, %s)"
        db_cursor.execute(sql, (user_id, name, asset_symbol))
        psql_db.commit()
        return Watchlist_Model.find_by_user_id(user_id)
    
    @staticmethod
    def remove_from_watchlist(user_id, name, asset_symbol):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "DELETE FROM watchlists WHERE user_id = %s AND name = %s AND asset_symbol = %s"
        db_cursor.execute(sql, (user_id, name, asset_symbol))
        psql_db.commit()
        return Watchlist_Model.find_by_user_id(user_id)