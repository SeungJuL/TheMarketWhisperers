from flask import Blueprint, request
from controller.stock_controller import Stock
stock_blueprint = Blueprint('stock', __name__)

@stock_blueprint.route('/search', methods= ['GET'])
def search():
    return Stock.stock_search(request.args.get('stock_name'))

@stock_blueprint.route('/<symbol>/price', methods = ['GET'])
def stock_price(symbol):
    return Stock.stock_price(symbol)

@stock_blueprint.route('/<symbol>/history')
def stock_history(symbol):
    return Stock.stock_history(symbol, request.args.get('period'), request.args.get('interval'))

@stock_blueprint.route('/<symbol>/metrics')
def stock_metrics(symbol):
    return Stock.stock_info(symbol)