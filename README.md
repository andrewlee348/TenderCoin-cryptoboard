# Crypto-Board

A crypto dashboard, integrated with CoinGecko and Kraken Exchange's APIs
Deployed here: https://andrewlee348.github.io/

## How to view your Kraken portfolio

Link to Kraken Exchange: https://www.kraken.com/

Follow this guide to set up your Kraken public and private API keys:
https://cryptopro.app/help/automatic-import/kraken-api-key/

Make sure to only select the key permissions outlined in the guide, nothing else.

Log into the website with your Google account.

Enter your public and private api keys in the Api Setup tab.

- Your api keys are stored safely using google firestore and only have permission to view your portfolio given you followed the guide and selected the right keypermissions.

The portfolio tab should now be working and displaying your Kraken portfolio.

##

Screenshot of the Kraken portfolio functionality:
![alt text](https://github.com/andrewlee348/crypto-board/blob/main/images/portfolio.png?raw=true)

## Installation

In the root directory run
'''
npm install
'''

Then run
'''
npm run start
'''

The backend was coded with Flask and the pip packages can be installed with
'''
pip install -r requirements.txt
'''

To start the local server, run
'''
python main.py
'''

## Further improvements

```
1. Support OHLC graphs
2. Add paper trading
```
