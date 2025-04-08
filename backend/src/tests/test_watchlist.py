import pytest
from controllers.watchlist_controller import WatchlistController
from unittest.mock import patch, MagicMock


@patch('controllers.watchlist_controller.WatchlistModel')
@patch('controllers.watchlist_controller.current_user')
def test_get_watchlists_success(mock_current_user, mock_watchlist_model):
    # Setup
    mock_current_user.id = 1
    mock_watchlist_model.return_value.get_watchlist_id.return_value = 1
    mock_watchlist_model.return_value.get_items.return_value = [
        ('AAPL', 'Apple Inc.'),
        ('GOOGL', 'Alphabet Inc.')
    ]
    
    # Test
    controller = WatchlistController()
    response, status_code = controller.get_watchlists()
    
    # Verify
    assert status_code == 200
    assert response['success'] == True
    assert response['message'] == 'Watchlists retrieved successfully'
    assert len(response['data']) == 2
    assert response['data'][0]['asset_symbol'] == 'AAPL'
    assert response['data'][0]['name'] == 'Apple Inc.'
    assert response['data'][1]['asset_symbol'] == 'GOOGL'
    assert response['data'][1]['name'] == 'Alphabet Inc.'

@patch('controllers.watchlist_controller.WatchlistModel')
@patch('controllers.watchlist_controller.current_user')
def test_get_watchlists_error(mock_current_user, mock_watchlist_model):
    # Setup
    mock_current_user.id = 1
    mock_watchlist_model.return_value.get_watchlist_id.side_effect = Exception('Database error')
    
    # Test
    controller = WatchlistController()
    response, status_code = controller.get_watchlists()
    
    # Verify
    assert status_code == 500
    assert response['success'] == False
    assert 'An error occurred while retrieving watchlists' in response['message']

@patch('controllers.watchlist_controller.WatchlistModel')
@patch('controllers.watchlist_controller.current_user')
def test_add_to_watchlist_success(mock_current_user, mock_watchlist_model):
    # Setup
    mock_current_user.id = 1
    mock_watchlist_model.return_value.get_watchlist_id.return_value = 1
    mock_watchlist_model.return_value.add_to_watchlist.return_value = True
    
    # Test
    controller = WatchlistController()
    data = {
        'asset_symbol': 'AAPL',
        'name': 'Apple Inc.'
    }
    response, status_code = controller.add_to_watchlist(data)
    
    # Verify
    assert status_code == 201
    assert response['success'] == True
    assert response['message'] == 'Asset added to watchlist'
    assert response['data'] == 'AAPL'

@patch('controllers.watchlist_controller.WatchlistModel')
@patch('controllers.watchlist_controller.current_user')
def test_add_to_watchlist_missing_data(mock_current_user, mock_watchlist_model):
    # Setup
    mock_current_user.id = 1
    
    # Test
    controller = WatchlistController()
    data = {
        'asset_symbol': 'AAPL'
        # name is missing
    }
    response, status_code = controller.add_to_watchlist(data)
    
    # Verify
    assert status_code == 400
    assert response['success'] == False
    assert response['message'] == 'Name and asset symbol are required'
    assert response['data'] == None

@patch('controllers.watchlist_controller.WatchlistModel')
@patch('controllers.watchlist_controller.current_user')
def test_add_to_watchlist_error(mock_current_user, mock_watchlist_model):
    # Setup
    mock_current_user.id = 1
    mock_watchlist_model.return_value.get_watchlist_id.return_value = 1
    mock_watchlist_model.return_value.add_to_watchlist.side_effect = Exception('Database error')
    
    # Test
    controller = WatchlistController()
    data = {
        'asset_symbol': 'AAPL',
        'name': 'Apple Inc.'
    }
    response, status_code = controller.add_to_watchlist(data)
    
    # Verify
    assert status_code == 500
    assert response['success'] == False
    assert 'An error occurred while adding to watchlist' in response['message']

@patch('controllers.watchlist_controller.WatchlistModel')
@patch('controllers.watchlist_controller.current_user')
def test_remove_from_watchlist_success(mock_current_user, mock_watchlist_model):
    # Setup
    mock_current_user.id = 1
    mock_watchlist_model.return_value.get_watchlist_id.return_value = 1
    mock_watchlist_model.return_value.remove_from_watchlist.return_value = True
    
    # Test
    controller = WatchlistController()
    data = {
        'asset_symbol': 'AAPL'
    }
    response, status_code = controller.remove_from_watchlist(data)
    
    # Verify
    assert status_code == 200
    assert response['success'] == True
    assert response['message'] == 'Asset removed from watchlist'
    assert response['data'] == 'AAPL'

@patch('controllers.watchlist_controller.WatchlistModel')
@patch('controllers.watchlist_controller.current_user')
def test_remove_from_watchlist_missing_data(mock_current_user, mock_watchlist_model):
    # Setup
    mock_current_user.id = 1
    
    # Test
    controller = WatchlistController()
    data = {
        # asset_symbol is missing
    }
    response, status_code = controller.remove_from_watchlist(data)
    
    # Verify
    assert status_code == 400
    assert response['success'] == False
    assert response['message'] == 'Asset symbol are required'
    assert response['data'] == None

@patch('controllers.watchlist_controller.WatchlistModel')
@patch('controllers.watchlist_controller.current_user')
def test_remove_from_watchlist_error(mock_current_user, mock_watchlist_model):
    # Setup
    mock_current_user.id = 1
    mock_watchlist_model.return_value.get_watchlist_id.return_value = 1
    mock_watchlist_model.return_value.remove_from_watchlist.side_effect = Exception('Database error')
    
    # Test
    controller = WatchlistController()
    data = {
        'asset_symbol': 'AAPL'
    }
    response, status_code = controller.remove_from_watchlist(data)
    
    # Verify
    assert status_code == 500
    assert response['success'] == False
    assert 'An error occurred while removing from watchlist' in response['message']


