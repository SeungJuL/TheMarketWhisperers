from db.psql import conn_psql

class UserModel:
    def __init__(self):
        self.db = conn_psql()

    def find_by_id(self, user_id):
        db_cursor = self.db.cursor()
        sql = "SELECT * FROM users WHERE user_id = %s"
        db_cursor.execute(sql, (user_id,))
        user = db_cursor.fetchone()
        if not user:
            return None
        return user
    
    def find_by_email(self, user_email):
        db_cursor = self.db.cursor()
        sql = "SELECT * FROM users WHERE email = %s"
        db_cursor.execute(sql, (user_email,))
        user = db_cursor.fetchone()
        if not user:
            return None
        return user
    
    def save(self, email, password_hash, username):
        db_cursor = self.db.cursor()
        sql = "INSERT INTO users(email, password_hash, username) VALUES(%s, %s, %s)"
        db_cursor.execute(sql, (email, password_hash, username))
        self.db.commit()
        return self.find_by_email(email)
    
    def update_password(self, user_id, new_password):
        db_cursor = self.db.cursor()
        sql = "UPDATE users SET password_hash = %s WHERE user_id = %s"
        db_cursor.execute(sql, (new_password, user_id))
        self.db.commit()
        return True
        
    def update_profile(self, user_id, update_data):
        db_cursor = self.db.cursor()
        
        # Build the SQL query
        sql = "UPDATE users SET "
        values = []
        
        # Add each field to update
        if 'username' in update_data:
            sql += "username = %s, "
            values.append(update_data['username'])
        if 'bio' in update_data:
            sql += "bio = %s, "
            values.append(update_data['bio'])
        if 'phone_number' in update_data:
            sql += "phone_number = %s, "
            values.append(update_data['phone_number'])
        
        # Add updated_at and where clause
        sql += "updated_at = CURRENT_TIMESTAMP WHERE user_id = %s"
        values.append(user_id)
        
        # Execute the query
        db_cursor.execute(sql, values)
        self.db.commit()
        return True


    def update_profile_picture(self, user_id, file_path):
        db_cursor = self.db.cursor()
        sql = "UPDATE users SET profile_picture_path = %s, updated_at = CURRENT_TIMESTAMP WHERE user_id = %s"
        db_cursor.execute(sql, (file_path, user_id))
        self.db.commit()
        return True
    
        