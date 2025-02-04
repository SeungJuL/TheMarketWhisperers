from flask import request, jsonify, redirect, session
from flask_login import UserMixin, login_user, current_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from model.user_model import User_Model
from dto.response_dto import ResponseUtil

class User(UserMixin):
    def __init__(self, user_id, user_email, user_password):
        self.id = user_id
        self.user_email = user_email
        self.user_password = user_password
    
    def get_id(self):
        return str(self.id)
    
    @staticmethod
    def register():
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            username = data.get('username')

            # password hashing
            password_hash = generate_password_hash(password)

            # save user data in db
            user = User_Model.save(email, password_hash, username)
            if user is None:
                return ResponseUtil.error('Register Failed', None), 500
            else:
                return ResponseUtil.success('Register Success', user), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred during registration', str(e)), 500
        
    @staticmethod
    def login():
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')

            # Compare with db user
            user = User_Model.find_by_email(email)
            if user is None:
                return ResponseUtil.failure('No matching email in db', None), 400
            is_valid_pwd = check_password_hash(user.password_hash, password)
            if not is_valid_pwd:
                return ResponseUtil.failure('Password not matched', None), 400
            
            # login by session
            login_user(user)
            return ResponseUtil.success('Login success', user), 201

        except Exception as e:
            return ResponseUtil.error('An error occurred during login', str(e)), 500
