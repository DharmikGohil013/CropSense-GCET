from flask import Blueprint, request, jsonify
import requests

weather_bp = Blueprint('weather', __name__)

API_KEY = '1e3e8f230b6064d27976e41163a82b77'
BASE_URL = 'http://api.weatherapi.com/v1/current.json'

@weather_bp.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    try:
        response = requests.get(BASE_URL, params={'key': API_KEY, 'q': city})
        response.raise_for_status()
        weather_data = response.json()

        return jsonify({
            "location": weather_data['location']['name'],
            "region": weather_data['location']['region'],
            "country": weather_data['location']['country'],
            "temperature_c": weather_data['current']['temp_c'],
            "condition": weather_data['current']['condition']['text'],
            "humidity": weather_data['current']['humidity'],
            "wind_kph": weather_data['current']['wind_kph'],
        })
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    except KeyError:
        return jsonify({"error": "Error parsing weather data"}), 500