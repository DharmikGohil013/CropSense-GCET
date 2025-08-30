from flask import Flask
from routes.prediction import prediction_bp
from routes.weather import weather_bp

app = Flask(__name__)

# Register blueprints for routes
app.register_blueprint(prediction_bp)
app.register_blueprint(weather_bp)

@app.route('/')
def home():
    return "Welcome to the Rice Disease Detection API!"

if __name__ == '__main__':
    app.run(debug=True)