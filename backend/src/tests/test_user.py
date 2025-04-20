import pytest
from controllers.user_controller import UserController, User
from unittest.mock import patch, MagicMock


@patch('controllers.user_controller.UserModel')
@patch('controllers.user_controller.current_user')
def test_profile_success(mock_current_user, mock_user_model):
    # Setup
    mock_current_user.id = 1
    mock_user_model.return_value.find_by_id.return_value = (1, 'test@example.com', 'hashed_password', 'username', '2023-01-01', None, None, None)
    
    # Test
    controller = UserController()
    response, status_code = controller.get_profile()
    
    # Verify
    assert status_code == 200
    assert response['success'] == True
    assert response['message'] == 'Profile retrieved successfully'
    assert response['data']['email'] == 'test@example.com'
    assert response['data']['username'] == 'username'

@patch('controllers.user_controller.UserModel')
@patch('controllers.user_controller.current_user')
def test_profile_user_not_found(mock_current_user, mock_user_model):
    # Setup
    mock_current_user.id = 1
    mock_user_model.return_value.find_by_id.return_value = None
    
    # Test
    controller = UserController()
    response, status_code = controller.get_profile()
    
    # Verify
    assert status_code == 404
    assert response['success'] == False
    assert response['message'] == 'User not found'

@patch('controllers.user_controller.UserModel')
@patch('controllers.user_controller.WatchlistModel')
@patch('controllers.user_controller.generate_password_hash')
def test_register_success(mock_generate_password_hash, mock_watchlist_model, mock_user_model):
    # Setup
    mock_user_model.return_value.find_by_email.return_value = None
    mock_user_model.return_value.save.return_value = (1, 'test@example.com', 'hashed_password', 'username')
    mock_generate_password_hash.return_value = 'hashed_password'
    mock_watchlist_model.return_value.create_watchlist.return_value = True
    
    # Test
    controller = UserController()
    data = {
        'email': 'test@example.com',
        'password': 'password123',
        'username': 'username'
    }
    response, status_code = controller.register(data)
    
    # Verify
    assert status_code == 201
    assert response['success'] == True
    assert response['message'] == 'Register Success'
    assert response['data']['email'] == 'test@example.com'
    assert response['data']['username'] == 'username'

@patch('controllers.user_controller.UserModel')
def test_register_duplicate_email(mock_user_model):
    # Setup
    mock_user_model.return_value.find_by_email.return_value = (1, 'test@example.com', 'hashed_password', 'username')
    
    # Test
    controller = UserController()
    data = {
        'email': 'test@example.com',
        'password': 'password123',
        'username': 'username'
    }
    response, status_code = controller.register(data)
    
    # Verify
    assert status_code == 400
    assert response['success'] == False
    assert response['message'] == 'Duplicate email address'
    assert response['data'] == None

@patch('controllers.user_controller.UserModel')
@patch('controllers.user_controller.WatchlistModel')
@patch('controllers.user_controller.generate_password_hash')
def test_register_save_failed(mock_generate_password_hash, mock_watchlist_model, mock_user_model):
    # Setup
    mock_user_model.return_value.find_by_email.return_value = None
    mock_user_model.return_value.save.return_value = None
    mock_generate_password_hash.return_value = 'hashed_password'
    
    # Test
    controller = UserController()
    data = {
        'email': 'test@example.com',
        'password': 'password123',
        'username': 'username'
    }
    response, status_code = controller.register(data)
    
    # Verify
    assert status_code == 500
    assert response['success'] == False
    assert response['message'] == 'Register Failed'
    assert response['data'] == None

@patch('controllers.user_controller.UserModel')
@patch('controllers.user_controller.check_password_hash')
@patch('controllers.user_controller.login_user')
def test_login_success(mock_login_user, mock_check_password_hash, mock_user_model):
    # Setup
    mock_user_model.return_value.find_by_email.return_value = (1, 'test@example.com', 'hashed_password', 'username')
    mock_check_password_hash.return_value = True
    
    # Test
    controller = UserController()
    data = {
        'email': 'test@example.com',
        'password': 'password123'
    }
    response, status_code = controller.login(data)
    
    # Verify
    assert status_code == 201
    assert response['success'] == True
    assert response['message'] == 'Login success'
    assert response['data']['email'] == 'test@example.com'

@patch('controllers.user_controller.UserModel')
def test_login_user_not_found(mock_user_model):
    # Setup
    mock_user_model.return_value.find_by_email.return_value = None
    
    # Test
    controller = UserController()
    data = {
        'email': 'test@example.com',
        'password': 'password123'
    }
    response, status_code = controller.login(data)
    
    # Verify
    assert status_code == 400
    assert response['success'] == False
    assert response['message'] == 'No matching email in db'
    assert response['data'] == None

@patch('controllers.user_controller.UserModel')
@patch('controllers.user_controller.check_password_hash')
def test_login_wrong_password(mock_check_password_hash, mock_user_model):
    # Setup
    mock_user_model.return_value.find_by_email.return_value = (1, 'test@example.com', 'hashed_password', 'username')
    mock_check_password_hash.return_value = False
    
    # Test
    controller = UserController()
    data = {
        'email': 'test@example.com',
        'password': 'wrong_password'
    }
    response, status_code = controller.login(data)
    
    # Verify
    assert status_code == 400
    assert response['success'] == False
    assert response['message'] == 'Password not matched'
    assert response['data'] == None

@patch('controllers.user_controller.UserModel')
def test_user_get_success(mock_user_model):
    # Setup
    mock_user_model.return_value.find_by_id.return_value = (1, 'test@example.com', 'hashed_password', 'username')
    
    # Test
    user = User.get(1)
    
    # Verify
    assert user.id == 1
    assert user.user_email == 'test@example.com'
    assert user.user_password == 'hashed_password'

@patch('controllers.user_controller.UserModel')
def test_user_get_not_found(mock_user_model):
    # Setup
    mock_user_model.return_value.find_by_id.return_value = None
    
    # Test
    user = User.get(1)
    
    # Verify
    assert user is None
