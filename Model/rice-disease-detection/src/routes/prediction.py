from flask import Blueprint, request, jsonify
from src.models.rice_model import load_rice_model, predict_rice
from src.utils.config import GEMINI_API_KEY, WEATHER_API_KEY

prediction_bp = Blueprint('prediction', __name__)

# Load the rice disease detection model
model_path = 'data/models/rice_model.pkl'
learn = load_rice_model(model_path)

@prediction_bp.route('/predict', methods=['POST'])
def predict():
    data = request.json
    img_path = data.get('image_path')

    if not img_path:
        return jsonify({"error": "Image path is required"}), 400

    try:
        prediction = predict_rice(learn, img_path)
        return jsonify(prediction), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500