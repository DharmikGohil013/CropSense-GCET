import requests

class WeatherClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "http://api.weatherapi.com/v1"

    def get_weather(self, location):
        url = f"{self.base_url}/current.json?key={self.api_key}&q={location}"
        response = requests.get(url)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error fetching weather data: {response.status_code} - {response.text}")