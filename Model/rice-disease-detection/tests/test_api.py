import unittest
from src.api.gemini_client import GeminiClient
from src.api.weather_client import WeatherClient

class TestGeminiClient(unittest.TestCase):
    def setUp(self):
        self.gemini_client = GeminiClient(api_key="AIzaSyC5MTOY-TlP-EL39yMZhTk2dkGVbPRG5mw")

    def test_get_data(self):
        response = self.gemini_client.get_data()
        self.assertIsNotNone(response)
        self.assertIn('data', response)

class TestWeatherClient(unittest.TestCase):
    def setUp(self):
        self.weather_client = WeatherClient(api_key="1e3e8f230b6064d27976e41163a82b77")

    def test_get_weather(self):
        response = self.weather_client.get_weather("New York")
        self.assertIsNotNone(response)
        self.assertIn('weather', response)

if __name__ == '__main__':
    unittest.main()