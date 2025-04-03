from db.psql import conn_psql

class User_Model:
    def find_by_id(self, user_id):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "SELECT * FROM users WHERE user_id = %s"
        db_cursor.execute(sql, (user_id,))
        user = db_cursor.fetchone()
        if not user:
            return None
        return user
    
    def find_by_email(self, user_email):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "SELECT * FROM users WHERE email = %s"
        db_cursor.execute(sql, (user_email,))
        user = db_cursor.fetchone()
        if not user:
            return None
        return user
    
    def save(self, email, password_hash, username):
        psql_db = conn_psql()
        db_cursor = psql_db.cursor()
        sql = "INSERT INTO users(email, password_hash, username) VALUES(%s, %s, %s)"
        db_cursor.execute(sql, (email, password_hash, username))
        psql_db.commit()
        return self.find_by_email(email)
    
    
