from db.psql import conn_psql

class User_Model:
    @staticmethod
    def find_by_id(user_id):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "SELECT * FROM users WHERE user_id = %d"
        db_cursor.execute(sql, (user_id,))
        user = db_cursor.fetchone()
        return user
    
    @staticmethod
    def find_by_email(user_email):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "SELECT * FROM users WHERE email = %s"
        db_cursor.execute(sql, (user_email,))
        user = db_cursor.fetchone()
        return user
    
    @staticmethod
    def save(email, password_hash, username):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "INSERT INTO users(email, password_hash, username) VALUES(%s, %s, %s)"
        db_cursor.execute(sql, (email, password_hash, username))
        psql_db.commit()
        return User_Model.find_by_email(email)
    
    
