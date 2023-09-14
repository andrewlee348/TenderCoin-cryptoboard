from flask import Flask
from pycoingecko import CoinGeckoAPI
from flask_cors import CORS

import requests

app = Flask(__name__)
CORS(app)
cg = CoinGeckoAPI()

@app.route('/ping')
def ping():
    return {'pong': 'ping ponged'}, 200

@app.route('/get_allcrypto')
def get_allcrypto():
    try:
        data = cg.get_coins_markets(vs_currency='usd')

        return data, 200

    except Exception as e:
        return {'error': str(e)}, 500  # Handle exceptions

@app.route('/get_mostpopular')
def get_mostpopular():
    try:
        data = cg.get_coins_markets(vs_currency='usd')
        sorted_data = sorted(data, key=lambda x: x["market_cap"], reverse=True)
        sorted_data = sorted_data[:25]
        return sorted_data, 200

    except Exception as e:
        return {'error': str(e)}, 500  # Handle exceptions

@app.route('/get_topgainers')
def get_topgainers():
    try:
        data = cg.get_coins_markets(vs_currency='usd')
        sorted_data = sorted(data, key=lambda x: x["price_change_percentage_24h"], reverse=True)
        sorted_data = sorted_data[:25]
        return sorted_data, 200

    except Exception as e:
        return {'error': str(e)}, 500  # Handle exceptions

@app.route('/get_bigdippers')
def get_bigdippers():
    try:
        data = cg.get_coins_markets(vs_currency='usd')
        sorted_data = sorted(data, key=lambda x: x["price_change_percentage_24h"], reverse=False)
        sorted_data = sorted_data[:25]
        return sorted_data, 200

    except Exception as e:
        return {'error': str(e)}, 500  # Handle exceptions

@app.route('/get_ohlc/<coin_id>/<coin_time>')
def get_ohlc(coin_id,coin_time):
    try:
        data = cg.get_coin_ohlc_by_id(id=coin_id, vs_currency='usd', days=coin_time)

        return data, 200
        
    except Exception as e:
        return {'error': str(e)}, 500  # Handle exceptions

if __name__ == '__main__':
    app.run(debug=True, port=5001)