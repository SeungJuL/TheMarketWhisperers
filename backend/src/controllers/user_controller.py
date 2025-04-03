from flask_login import UserMixin, login_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models.user_model import User_Model
from models.watchlist_model import Watchlist_Model
from dtos.response_dto import ResponseUtil

class User(UserMixin):
    def __init__(self, user_id, user_email, user_password):
        self.id = user_id
        self.user_email = user_email
        self.user_password = user_password

    def get_id(self):
        return str(self.id)
    
    @staticmethod
    def get(user_id):
        user = User_Model.find_by_id(user_id)
        if user:
            return User(user[0], user[1], user[2])
        return None

class UserController:
    def register(self, data):
        try:
            email = data.get('email')
            password = data.get('password')
            username = data.get('username')

            # Check Duplicate email
            duplicate_user = User_Model.find_by_email(email)
            if duplicate_user:
                return ResponseUtil.failure("Duplicate email address", None), 400
            
            # Password hashing
            password_hash = generate_password_hash(password)

            # Save user in database
            user = User_Model.save(email, password_hash, username)
            if user is None:
                return ResponseUtil.error('Register Failed', None), 500
            else:
                Watchlist_Model.create_watchlist(user[0])
                return ResponseUtil.success('Register Success', {"email": user[1], "username": user[3]}), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred during registration', str(e)), 500

    def login(self, data):
        try:
            email = data.get('email')
            password = data.get('password')

            # Check user in database
            user = User_Model.find_by_email(email)
            if user is None:
                return ResponseUtil.failure('No matching email in db', None), 400

            is_valid_pwd = check_password_hash(user[2], password)
            if not is_valid_pwd:
                return ResponseUtil.failure('Password not matched', None), 400

            # Convert tuple to User instance
            user_instance = User(user[0], user[1], user[2])

            # Log in user
            login_user(user_instance)
            return ResponseUtil.success('Login success', {"email": user[1]}), 201

        except Exception as e:
            return ResponseUtil.error('An error occurred during login', str(e)), 500
        
    def profile(self):
        try:
            user_info = User_Model.find_by_id(current_user.id)
            user_profile = {
                "email": user_info[1],
                "username": user_info[3]
            }
            return ResponseUtil.success('Sucess getting user profile', user_profile), 201
        except Exception as e:
                return ResponseUtil.error('An error occurred during login', str(e)), 500
