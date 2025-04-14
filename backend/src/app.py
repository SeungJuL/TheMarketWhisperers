from flask import Flask, jsonify, make_response
from flask_login import LoginManager
from flask_cors import CORS 
from dotenv import load_dotenv
from controllers.user_controller import User
from blueprints.user import user_blueprint
from blueprints.stock import stock_blueprint
from blueprints.watchlist import watchlist_blueprint
from blueprints.ai import ai_blueprint
import os


app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

# session
load_dotenv()
app.secret_key = os.getenv('SESSION_SECRET_KEY')
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = 'strong'

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@login_manager.unauthorized_handler
def unauthorized():
    return make_response(jsonify(success=False), 401)

# blue print
app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(stock_blueprint, url_prefix='/stock')
app.register_blueprint(watchlist_blueprint, url_prefix='/watchlist')
app.register_blueprint(ai_blueprint, url_prefix='/ai')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8080', debug=True)