from flask import Flask
from pycoingecko import CoinGeckoAPI
from flask_cors import CORS
import krakenex
import requests
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("credentials.json")
firebase_admin.initialize_app(cred)

# Create a Firestore client
db = firestore.client()

app = Flask(__name__)
CORS(app)
cg = CoinGeckoAPI()

def get_api_key_and_secret(user_id):
    try:
        # Retrieve the user's document from Firestore
        user_ref = db.collection("users").document(user_id)
        user_data = user_ref.get()

        if not user_data.exists:
            return {'error': 'User not found'}, 404

        api_key = user_data.to_dict().get("api_key", "")
        api_secret = user_data.to_dict().get("api_secret", "")

        return {
            'api_key': api_key,
            'api_secret': api_secret
        }, 200
    except Exception as e:
        return {'error': str(e)}, 500  # Handle exceptions

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

@app.route('/get_balance/<user_id>')
def get_balance(user_id):
  try:
    # Call the function to get API key and secret
    api_data, status_code = get_api_key_and_secret(user_id)

    if status_code != 200:
      return api_data, status_code

    api_key = api_data['api_key']
    api_secret = api_data['api_secret']

    # Create a krakenex API object using the retrieved api_key and api_secret
    k = krakenex.API(api_key, api_secret)

    # Query the balance using the krakenex API object
    query = k.query_private('Balance')

    return query, 200
  except Exception as e:
    return {'error': str(e)}, 500  # Handle exceptions

@app.route('/add_data', methods=['POST'])
def add_data():
    try:
        data = request.get_json()
        db.collection('users').add(data)
        return jsonify({"message": "Data added to Firestore successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)