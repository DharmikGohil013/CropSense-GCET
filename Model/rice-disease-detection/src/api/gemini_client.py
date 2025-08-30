import requests

class GeminiClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.gemini.com/v1"

    def get_market_data(self, symbol):
        url = f"{self.base_url}/marketdata/{symbol}"
        headers = {"X-GEMINI-APIKEY": self.api_key}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_order_book(self, symbol):
        url = f"{self.base_url}/book/{symbol}"
        headers = {"X-GEMINI-APIKEY": self.api_key}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def place_order(self, symbol, amount, price, side):
        url = f"{self.base_url}/order/new"
        headers = {"X-GEMINI-APIKEY": self.api_key}
        order_data = {
            "symbol": symbol,
            "amount": amount,
            "price": price,
            "side": side,
            "type": "exchange limit"
        }
        response = requests.post(url, json=order_data, headers=headers)
        response.raise_for_status()
        return response.json()