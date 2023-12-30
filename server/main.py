from flask import Flask, request, jsonify
from pycoingecko import CoinGeckoAPI
from flask_cors import CORS
import krakenex
import requests
import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask_caching import Cache

app = Flask(__name__)
CORS(app)
cg = CoinGeckoAPI()

cred = credentials.Certificate("./credentials.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
user_Ref = db.collection('users')

firebase_cert_url = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uoyqa%40crypto-boar.iam.gserviceaccount.com"

response = requests.get(firebase_cert_url)
public_keys = response.json()

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/get_allcrypto')
@cache.cached(timeout=60)
def get_allcrypto():
  try:
    data = cg.get_coins_markets(vs_currency='usd')

    return data, 200

  except Exception as e:
    return {'error': str(e)}, 500  # Handle exceptions

@app.route('/get_mostpopular')
@cache.cached(timeout=60)
def get_mostpopular():
  try:
    data = cg.get_coins_markets(vs_currency='usd')
    sorted_data = sorted(data, key=lambda x: x["market_cap"], reverse=True)
    sorted_data = sorted_data[:25]
    return sorted_data, 200

  except Exception as e:
    return {'error': str(e)}, 500  # Handle exceptions

@app.route('/get_topgainers')
@cache.cached(timeout=60)
def get_topgainers():
  try:
    data = cg.get_coins_markets(vs_currency='usd')
    sorted_data = sorted(data, key=lambda x: x["price_change_percentage_24h"], reverse=True)
    sorted_data = sorted_data[:25]
    return sorted_data, 200

  except Exception as e:
    return {'error': str(e)}, 500  # Handle exceptions

@app.route('/get_bigdippers')
@cache.cached(timeout=60)
def get_bigdippers():
  try:
    data = cg.get_coins_markets(vs_currency='usd')
    sorted_data = sorted(data, key=lambda x: x["price_change_percentage_24h"], reverse=False)
    sorted_data = sorted_data[:25]
    return sorted_data, 200

  except Exception as e:
    return {'error': str(e)}, 500  # Handle exceptions

@app.route('/get_ohlc/<coin_id>/<coin_time>')
@cache.cached(timeout=60)
def get_ohlc(coin_id,coin_time):
  try:
    data = cg.get_coin_ohlc_by_id(id=coin_id, vs_currency='usd', days=coin_time)

    return data, 200
      
  except Exception as e:
    return {'error': str(e)}, 500  # Handle exceptions

def get_api_key_and_secret(user_id):
  try:
    # Retrieve the user's document from Firestore
    user_ref = db.collection("users").document(user_id)
    user_data = user_ref.get()

    if not user_data.exists:
      return {'error': 'User not found'}, 404

    api_data = user_data.to_dict()

    return api_data, 200
  except Exception as e:
    return {'error': str(e)}, 500  # Handle exceptions

@app.route('/get_balance', methods=['POST'])
def get_balance():
  try:
    data = request.get_json()
    user_id = data.get('uid')

    # Call the function to get API key and secret
    api_data, status_code = get_api_key_and_secret(user_id)

    if status_code != 200:
      return api_data, status_code

    # print(api_data)

    api_key = api_data['api_key']
    api_secret = api_data['api_secret']

    # Create a krakenex API object using the retrieved api_key and api_secret
    k = krakenex.API(api_key, api_secret)

    # Query the balance using the krakenex API object
    query = k.query_private('Balance')
    assets_data = k.query_public('Assets')

    assets_mapping = {symbol: asset_info['altname'] for symbol, asset_info in assets_data['result'].items()}

    # Modify the query response to change symbol values using the mapping
    
    modified_query = {}
    for symbol, amount in query['result'].items():
      price = k.query_public('Ticker', 'pair='+symbol+'ZUSD')['result'][symbol+'ZUSD']['c'][0]
      holding = float(price) * float(amount)
      modified_query[assets_mapping[symbol]] = {'amount': amount, 'holding': holding}
    
    result = {}
    result['error'] = query['error']
    result['result'] = modified_query

    return result, 200
  except Exception as e:
    return {'error': str(e)}, 500  # Handle exceptions

@app.route('/check_user', methods=['POST'])
def check_user():
  try:
    data = request.get_json()
    user_id = data.get('uid')
    user_ref = db.collection('users').document(user_id)

    if not user_ref.get().exists:
      user_data = {
        'api_key': None,
        'api_secret': None
      }
      user_ref.set(user_data)
      
    return {"message": "User data updated successfully"}, 200
  except Exception as error:
    return {"error": str(error)}, 500

@app.route('/update_user', methods=['POST'])
def update_user():
  try:
    # Get the api_key and api_secret from the form data
    data = request.get_json()
    user_id = data.get('uid')
    api_key = data.get('api_key')
    api_secret = data.get('api_secret')

    # Create a Firestore document reference using the user's UID
    user_ref = db.collection('users').document(user_id)
    if api_key is not None and api_secret is not None:
      user_data = {
        'api_key': api_key,
        'api_secret': api_secret
      }
    else:
      user_data = {
        'api_key': None,
        'api_secret': None
      }

    # Set the data in the Firestore document, this will create/update it
    user_ref.set(user_data)

    return {"message": "User data updated successfully"}, 200
  except Exception as error:
    return {"error": str(error)}, 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)