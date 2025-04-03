from flask import Blueprint, request
from controllers.stock_controller import Stock

stock_blueprint = Blueprint('stock', __name__)
stock_controller = Stock()

@stock_blueprint.route('/search', methods= ['GET'])
def search():
    return stock_controller.symbol_search(request.args.get('stock_name'))

@stock_blueprint.route('/<symbol>/price', methods = ['GET'])
def current_price(symbol):
    return stock_controller.current_price(symbol)

@stock_blueprint.route('/<symbol>/history', methods = ['GET'])
def stock_history(symbol):
    return stock_controller.stock_history(
        symbol, 
        request.args.get("period", "1mo"), 
        request.args.get("interval", "1d")
        )

@stock_blueprint.route('/<symbol>/info', methods = ['GET'])
def stock_metrics(symbol):
    return stock_controller.company_info(symbol)