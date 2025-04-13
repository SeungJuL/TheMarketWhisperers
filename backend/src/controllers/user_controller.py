from flask_login import UserMixin, login_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models.user_model import UserModel
from models.watchlist_model import WatchlistModel
from dtos.response_dto import ResponseUtil
from flask import request
import os
from werkzeug.utils import secure_filename

class User(UserMixin):
    def __init__(self, user_id, user_email, user_password):
        self.id = user_id
        self.user_email = user_email
        self.user_password = user_password

    def get_id(self):
        return str(self.id)
    
    @classmethod
    def get(cls, user_id):
        user_model = UserModel()
        user = user_model.find_by_id(user_id)
        if user:
            return cls(user[0], user[1], user[2])
        return None

class UserController:
    def __init__(self):
        self.user_model = UserModel()
        self.watchlist_model = WatchlistModel()
        self.UPLOAD_FOLDER = 'uploads/profile_pictures'

    # For the future validation of password
    # def validate_password(self, password):
    #     if len(password) < 8:
    #         return False, 'Password must be at least 8 characters long'
    #     if not any(c.isupper() for c in password):
    #         return False, 'Password must contain at least one uppercase letter'
    #     if not any(c.islower() for c in password):
    #         return False, 'Password must contain at least one lowercase letter'
    #     if not any(c.isdigit() for c in password):
    #         return False, 'Password must contain at least one number'
    #     return True, None

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
                return ResponseUtil.success('Register Success', {"email": user[1], "username": user[3]}), 201
        except Exception as e:
            return ResponseUtil.error('An error occurred during registration', str(e)), 500

    def login(self, data):
        try:
            email = data.get('email')
            password = data.get('password')

            # Check user in database
            user = self.user_model.find_by_email(email)
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

    def get_profile(self):
        try:
            user_info = self.user_model.find_by_id(current_user.id)
            if not user_info:
                return ResponseUtil.failure('User not found', None), 404

            profile_data = {
                'email': user_info[1],
                'username': user_info[3],
                'profile_picture_path': user_info[5],
                'bio': user_info[6],
                'phone_number': user_info[7]
            }

            return ResponseUtil.success('Profile retrieved successfully', profile_data), 200

        except Exception as e:
            return ResponseUtil.error('An error occurred while retrieving profile', str(e)), 500
    

    def update_profile(self, data):
        try:
            user_id = current_user.id
            update_data = {
                'username': data.get('username'),
                'bio': data.get('bio'),
                'phone_number': data.get('phone_number'),
                'address': data.get('address')
            }
            
            # Remove None values
            update_data = {k: v for k, v in update_data.items() if v is not None}
            
            # Check if there's anything to update
            if not update_data:
                return ResponseUtil.failure('No data provided for update', None), 400

            success = self.user_model.update_profile(user_id, update_data)
            if not success:
                return ResponseUtil.error('Failed to update profile', None), 500

            return ResponseUtil.success('Profile updated successfully', None), 200

        except Exception as e:
            return ResponseUtil.error('An error occurred while updating profile', str(e)), 500

    def update_profile_picture(self):
        try:
            # Check if file exists in request
            if 'profile_picture' not in request.files:
                return ResponseUtil.failure('No file provided', None), 400

            file = request.files['profile_picture']
            
            # Check if file is selected
            if file.filename == '':
                return ResponseUtil.failure('No selected file', None), 400

            # Check file extension
            filename = file.filename.lower()
            if not (filename.endswith('.png') or filename.endswith('.jpg') or 
                   filename.endswith('.jpeg') or filename.endswith('.gif')):
                return ResponseUtil.failure('File type not allowed. Only png, jpg, jpeg, gif are allowed', None), 400

            filename = secure_filename(f"{current_user.id}_{file.filename}")
            file_path = os.path.join(self.UPLOAD_FOLDER, filename)
            
            # Create directory if it doesn't exist
            os.makedirs(self.UPLOAD_FOLDER, exist_ok=True)
    
            # Save file
            file.save(file_path)
            
            success = self.user_model.update_profile_picture(current_user.id, file_path)
            if not success:
                return ResponseUtil.error('Failed to update profile picture', None), 500

            return ResponseUtil.success('Profile picture updated successfully', {'file_path': file_path}), 200

        except Exception as e:
            return ResponseUtil.error('An error occurred while updating profile picture', str(e)), 500

    def change_password(self, data):
        try:
            current_password = data.get('current_password')
            new_password = data.get('new_password')

            if not current_password or not new_password:
                return ResponseUtil.failure('Please provide both current and new password', None), 400

            if not check_password_hash(current_user.user_password, current_password):
                return ResponseUtil.failure('Current password is incorrect', None), 401

            hashed_password = generate_password_hash(new_password)
            if(self.user_model.update_password(current_user.id, hashed_password)):
                return ResponseUtil.success('Password updated successfully', None), 200
            else:
                return ResponseUtil.error('Failed to update password', None), 500
            
        except Exception as e:
            return ResponseUtil.error('An error occurred while updating password', str(e)), 500

        
