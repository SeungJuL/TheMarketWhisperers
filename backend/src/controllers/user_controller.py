from flask_login import UserMixin, login_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from models.user_model import UserModel
from models.watchlist_model import WatchlistModel
from dtos.response_dto import ResponseUtil
import jwt  # Add this import
from datetime import datetime, timedelta  # Add this import
import os  # Ensure this import is present
import logging  # Add this import
from flask import request  # Add this import

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class User(UserMixin):
    def __init__(self, user_id, user_email, user_password):
        self.id = user_id
        self.user_email = user_email
        self.user_password = user_password

    def get_id(self):
        return str(self.id)
    
    @classmethod
    def get(cls, user_id):
        user_model = UserModel();
        user = user_model.find_by_id(user_id)
        if user:
            return cls(user[0], user[1], user[2])
        return None

class UserController:
    def __init__(self):
        self.user_model = UserModel()
        self.watchlist_model = WatchlistModel()

    def register(self, data):
        try:
            email = data.get('email')
            password = data.get('password')
            username = data.get('username')

            # Check Duplicate email
            duplicate_user = self.user_model.find_by_email(email)
            if duplicate_user:
                return ResponseUtil.failure("Duplicate email address", None), 400
            
            # Password hashing
            password_hash = generate_password_hash(password)

            # Save user in database
            user = self.user_model.save(email, password_hash, username)
            if user is None:
                return ResponseUtil.error('Register Failed', None), 500
            else:
                self.watchlist_model.create_watchlist(user[0])

                # Generate JWT token
                token = jwt.encode(
                    {
                        "user_id": user[0],
                        "exp": datetime.utcnow() + timedelta(hours=24)  # Token expires in 24 hours
                    },
                    os.getenv('SESSION_SECRET_KEY'),
                    algorithm="HS256"
                )

                return ResponseUtil.success('Register Success', {
                    "email": user[1],
                    "username": user[3],
                    "token": token
                }), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred during registration', str(e)), 500

    def login(self, data):
        try:
            logging.debug("Login method called")  # Debugging: Check if the method is called
            email = data.get('email')
            password = data.get('password')
            logging.debug(f"Received email: {email}, password: {password}")  # Debugging: Log input data

            # Check user in database
            user = self.user_model.find_by_email(email)
            if user is None:
                logging.warning("No matching email in database")  # Debugging: Log if user not found
                return ResponseUtil.failure('No matching email in db', None), 400

            is_valid_pwd = check_password_hash(user[2], password)
            if not is_valid_pwd:
                logging.warning("Password not matched")  # Debugging: Log if password is incorrect
                return ResponseUtil.failure('Password not matched', None), 400

            # Generate JWT token
            token = jwt.encode(
                {
                    "user_id": user[0],
                    "exp": datetime.utcnow() + timedelta(hours=24)  # Token expires in 24 hours
                },
                os.getenv('SESSION_SECRET_KEY'),
                algorithm="HS256"
            )
            # Removed unnecessary decoding logic
            logging.debug(f"Generated Token: {token}")  # Debugging: Log the token

            response_data = {"email": user[1], "token": token}
            logging.debug(f"Response Data: {response_data}")  # Debugging: Log response data

            # Convert tuple to User instance
            user_instance = User(user[0], user[1], user[2])

            # Log in user
            login_user(user_instance)
            logging.info("User logged in successfully")  # Debugging: Log successful login
            return ResponseUtil.success('Login success', response_data), 201

        except Exception as e:
            logging.error(f"Error occurred: {e}")  # Debugging: Log any exceptions
            return ResponseUtil.error('An error occurred during login', str(e)), 500
        
    def profile(self):  # Removed @login_required decorator
        try:
            user_id = request.user_id  # Use user_id from the request object
            print("User ID from token:", user_id)  # Debugging

            user_info = self.user_model.find_by_id(user_id)
            print("User Info Retrieved:", user_info)  # Debugging

            if not user_info:
                print("User not found in database")  # Debugging
                return ResponseUtil.failure('User not found', None), 400

            user_profile = {
                "user_id": user_info[0],
                "email": user_info[1],
                "username": user_info[3],  # Ensure username is included
                "created_at": user_info[4],  # Include created_at field
            }
            print("User Profile Response:", user_profile)  # Debugging
            return ResponseUtil.success('Success getting user profile', user_profile), 200
        except Exception as e:
            print("Error in profile method:", e)  # Debugging
            return ResponseUtil.error('An error occurred while fetching profile', str(e)), 500
