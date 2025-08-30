import io
import os
import pickle
import tempfile

# Import rice functions FIRST to ensure they're available in all namespaces
import rice_functions

import google.generativeai as genai
import gradio as gr
import numpy as np
import requests
import torch
from dotenv import load_dotenv
from PIL import Image
from torchvision import transforms

from utils.ai import from_ai
from utils.disease import disease_classes, disease_dic
from utils.fertilizer import fertilizer_dic, fertilizer_preprocess
from utils.model import ResNet9
from utils.rice_model import (
    combine_loss,
    disease_err,
    disease_loss,
    get_variety,
    load_rice_model,
    predict_rice,
    variety_err,
    variety_loss,
)
from utils.yields import yield_preprocess

load_dotenv()

# Set API keys from environment variables or use provided defaults
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyC5M1ojFvSsYW9M0HjVpbTViwlezdzMBjU")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "1e3e8f230b6064d27976e41163a82b77")

genai.configure(api_key=GEMINI_API_KEY)
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash", generation_config=generation_config
)

# Load models and preprocessing objects
crop_model_path = "models/crop_recommender.pkl"
yield_model_path = "models/yield_prediction.pkl"
fertilizer_model_path = "models/fertilizer_recommender.pkl"
disease_model_path = "models/disease_teller.pth"
rice_disease_model_path = "models/rice_disease.pkl"

with open(crop_model_path, "rb") as f:
    crop_model = pickle.load(f)

with open(yield_model_path, "rb") as f:
    tmodel = pickle.load(f)
    yield_model, yield_encoder, yield_scaler = (
        tmodel["model"],
        tmodel["one_hot_encoder"],
        tmodel["scaler"],
    )

with open(fertilizer_model_path, "rb") as f:
    fertilizer_model = pickle.load(f)

disease_model = ResNet9(3, len(disease_classes))
disease_model.load_state_dict(
    torch.load(disease_model_path, map_location=torch.device("cpu"), weights_only=True)
)
disease_model.eval()

rice_model = load_rice_model(rice_disease_model_path)


# Helper functions
def weather_fetch(city_name):
    api_key = WEATHER_API_KEY
    base_url = "http://api.openweathermap.org/data/2.5/weather?"

    # Validate city name
    if not city_name or city_name.strip() == "":
        print("Weather API error: City name is empty. Using default values.")
        return 25.0, 65.0  # Default temperature and humidity

    city_name = city_name.strip()
    complete_url = base_url + "appid=" + api_key + "&q=" + city_name
    
    try:
        response = requests.get(complete_url, timeout=10)
        x = response.json()

        if x.get("cod") == 200 and "main" in x:
            y = x["main"]
            temperature = round((y["temp"] - 273.15), 2)
            humidity = y["humidity"]
            return temperature, humidity
        else:
            # Return default values if weather API fails
            error_msg = x.get('message', 'Invalid response')
            print(f"Weather API error for city '{city_name}': {error_msg}")
            return 25.0, 65.0  # Default temperature and humidity
    except requests.exceptions.RequestException as e:
        print(f"Weather API request failed for city '{city_name}': {str(e)}")
        return 25.0, 65.0  # Default temperature and humidity
    except Exception as e:
        print(f"Weather API unexpected error for city '{city_name}': {str(e)}")
        return 25.0, 65.0  # Default temperature and humidity


def predict_image(img, model=disease_model):
    transform = transforms.Compose(
        [
            transforms.Resize(256),
            transforms.ToTensor(),
        ]
    )
    img_t = transform(img)  # img is already a PIL Image
    img_u = torch.unsqueeze(img_t, 0)

    # Get predictions from model
    yb = model(img_u)
    # Pick index with highest probability
    _, preds = torch.max(yb, dim=1)
    prediction = disease_classes[preds[0].item()]
    # Retrieve the class label
    return prediction


# Gradio Interfaces


# 1. Crop Prediction
def crop_predict(nitrogen, phosphorous, pottasium, ph, rainfall, city):
    # Validate inputs
    if not city or city.strip() == "":
        return "Error: Please enter a city name for weather data", None
    
    try:
        temperature, humidity = weather_fetch(city)
        input_data = np.array(
            [[nitrogen, phosphorous, pottasium, temperature, humidity, ph, rainfall]]
        )
        prediction = crop_model.predict(input_data)
        image_path = os.path.join("static", "images", f"{prediction[0]}.jpg")

        if os.path.exists(image_path):
            return prediction[0], image_path
        else:
            return prediction[0], None
    except Exception as e:
        return f"Error in crop prediction: {str(e)}", None


crop_inputs = [
    gr.Number(label="Nitrogen", value=50, minimum=0, info="Nitrogen content in soil (kg/ha)"),
    gr.Number(label="Phosphorous", value=25, minimum=0, info="Phosphorous content in soil (kg/ha)"),
    gr.Number(label="Pottasium", value=25, minimum=0, info="Potassium content in soil (kg/ha)"),
    gr.Number(label="pH", value=6.5, minimum=0, maximum=14, info="Soil pH level"),
    gr.Number(label="Rainfall", value=100, minimum=0, info="Annual rainfall (mm)"),
    gr.Textbox(label="City", value="Delhi", placeholder="Enter city name for weather data"),
]

crop_interface = gr.Interface(
    fn=crop_predict,
    inputs=crop_inputs,
    outputs=[gr.Textbox(label="Predicted Crop"), gr.Image(label="Crop Image")],
    title="Crop Prediction",
)


# 2. Yield Prediction
def yield_predict(
    nitrogen,
    phosphorous,
    pottasium,
    ph,
    rainfall,
    area,
    state,
    temperature,
    crop,
    crop_type,
):
    # Validate required fields and provide defaults if empty
    if not state or state.strip() == "":
        state = "uttar pradesh"  # Default state
    if not crop or crop.strip() == "":
        crop = "rice"  # Default crop
    if not crop_type or crop_type.strip() == "":
        crop_type = "kharif"  # Default crop type
    
    # Ensure all numeric values are provided
    if nitrogen is None:
        nitrogen = 50
    if phosphorous is None:
        phosphorous = 25
    if pottasium is None:
        pottasium = 25
    if ph is None:
        ph = 6.5
    if rainfall is None:
        rainfall = 100
    if temperature is None:
        temperature = 25
    if area is None:
        area = 1.0
    
    input_data = [
        state.lower().strip(),
        crop_type.lower().strip(),
        crop.lower().strip(),
        nitrogen,
        phosphorous,
        pottasium,
        ph,
        rainfall,
        temperature,
        area,
    ]
    
    try:
        X_input = yield_preprocess(input_data, yield_encoder, yield_scaler)
        prediction = yield_model.predict(X_input)
        return f"Predicted Yield: {prediction[0]:.2f} tons/hectare"
    except Exception as e:
        return f"Error in prediction: {str(e)}. Please check your inputs."


yield_inputs = [
    gr.Number(label="Nitrogen", value=50, info="Nitrogen content in soil (kg/ha)"),
    gr.Number(label="Phosphorous", value=25, info="Phosphorous content in soil (kg/ha)"),
    gr.Number(label="Pottasium", value=25, info="Potassium content in soil (kg/ha)"),
    gr.Number(label="pH", value=6.5, info="Soil pH level (0-14)"),
    gr.Number(label="Rainfall", value=100, info="Annual rainfall (mm)"),
    gr.Number(label="Area in Hectares", value=1.0, info="Cultivation area"),
    gr.Textbox(label="State", value="uttar pradesh", placeholder="e.g., uttar pradesh, punjab, haryana"),
    gr.Number(label="Temperature", value=25, info="Average temperature (°C)"),
    gr.Textbox(label="Crop", value="rice", placeholder="e.g., rice, wheat, sugarcane"),
    gr.Textbox(label="Crop Type", value="kharif", placeholder="e.g., kharif, rabi, zaid"),
]

yield_interface = gr.Interface(
    fn=yield_predict,
    inputs=yield_inputs,
    outputs=gr.Textbox(label="Predicted Yield"),
    title="Yield Prediction",
)


# 3. Fertilizer Prediction
def fertilizer_predict(
    nitrogen, phosphorous, pottasium, moisture, soil_type, crop, city
):
    # Validate inputs
    if not city or city.strip() == "":
        return "Error: Please enter a city name for weather data", "Weather data is required for accurate fertilizer recommendation"
    
    try:
        temperature, humidity = weather_fetch(city)
        input_data = np.array(
            [
                temperature,
                humidity,
                moisture,
                soil_type.capitalize(),
                crop.capitalize(),
                nitrogen,
                phosphorous,
                pottasium,
            ]
        )
        X_input = fertilizer_preprocess(input_data, fertilizer_model)
        prediction = fertilizer_model.predict(X_input)
        fertilizer_decoder = {
            0: "10-26-26",
            1: "14-35-14",
            2: "17-17-17",
            3: "20-20",
            4: "28-28",
            5: "DAP",
            6: "Urea",
        }
        decoded_prediction = fertilizer_decoder[prediction[0]]
        description = fertilizer_dic[decoded_prediction]
        return decoded_prediction, description
    except Exception as e:
        return f"Error in fertilizer prediction: {str(e)}", "Please check your inputs and try again"


fertilizer_inputs = [
    gr.Number(label="Nitrogen", value=50, minimum=0, info="Nitrogen content (kg/ha)"),
    gr.Number(label="Phosphorous", value=25, minimum=0, info="Phosphorous content (kg/ha)"),
    gr.Number(label="Pottasium", value=25, minimum=0, info="Potassium content (kg/ha)"),
    gr.Number(label="Moisture", value=60, minimum=0, maximum=100, info="Soil moisture (%)"),
    gr.Textbox(label="Soil Type", value="Loamy", placeholder="e.g., Sandy, Clay, Loamy"),
    gr.Textbox(label="Crop", value="Rice", placeholder="e.g., Rice, Wheat, Cotton"),
    gr.Textbox(label="City", value="Delhi", placeholder="Enter city name for weather data"),
]

fertilizer_interface = gr.Interface(
    fn=fertilizer_predict,
    inputs=fertilizer_inputs,
    outputs=[gr.Textbox(label="Predicted Fertilizer"), gr.Textbox(label="Description")],
    title="Fertilizer Prediction",
)


# 4. Disease Prediction
def disease_predict(img):
    print("Disease prediction started...")
    
    # Create a temporary file for the image
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_img:
        img.save(temp_img.name)  # Save the image to the temporary file
        print(f"Image saved to: {temp_img.name}")

        try:
            # Make predictions using both models
            print("Making prediction with ResNet9 model...")
            prediction = predict_image(img)  # Prediction from ResNet9 model (non-rice)
            print(f"ResNet9 prediction: {prediction}")
            
            print("Making prediction with rice model...")
            prediction2 = predict_rice(rice_model, temp_img.name)  # Prediction from rice-specific model
            print(f"Rice model prediction: {prediction2}")

            # Check if prediction2 is valid
            if prediction2 and isinstance(prediction2, dict):
                print("Calling AI model for analysis...")
                # Fetch AI result (Gemini or other) with the improved prompt
                result = from_ai(model, temp_img.name, prediction, prediction2)
                print(f"AI model result: {result}")
            else:
                print("Rice model prediction failed, using default values...")
                result = ("Unknown Crop", prediction if prediction else "Unknown Disease", "Please consult an agricultural expert for proper diagnosis.")

        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            result = ("Error", "Prediction Failed", f"An error occurred during prediction: {str(e)}")

    # Remove the temporary image file
    try:
        os.remove(temp_img.name)
        print("Temporary file removed")
    except:
        print("Could not remove temporary file")

    # Ensure that result is a tuple and contains all the expected fields
    if isinstance(result, tuple) and len(result) == 3:
        crop_name, disease_name, prevention = result
    elif result == "error":
        crop_name = "Error"
        disease_name = "AI Processing Failed"
        prevention = "There was an error processing your image. Please try again with a clearer image of a plant leaf."
    else:
        crop_name = "Unknown Crop"
        disease_name = "Unknown Disease"
        prevention = "No prevention information available"

    print(f"Final result: Crop={crop_name}, Disease={disease_name}")
    
    # Return three outputs: crop name, disease name, and prevention/treatment info
    return (crop_name, disease_name, prevention)


# Update the Gradio interface to include three outputs: disease name, confidence, and prevention/treatment
disease_interface = gr.Interface(
    fn=disease_predict,
    inputs=gr.Image(type="pil", label="Leaf Image"),
    outputs=[
        gr.Textbox(label="Crop"),
        gr.Textbox(label="Disease"),
        gr.Textbox(label="Description"),
    ],
    title="Disease Prediction",
)

# Launch the interfaces together
iface = gr.TabbedInterface(
    [crop_interface, yield_interface, fertilizer_interface, disease_interface],
    [
        "Crop Prediction",
        "Yield Prediction",
        "Fertilizer Recommendation",
        "Disease Prediction",
    ],
)

# Create a custom Gradio app with manifest.json support
import gradio as gr
from fastapi import FastAPI
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to handle browser extension issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve manifest.json
@app.get("/manifest.json")
async def get_manifest():
    return FileResponse("manifest.json", media_type="application/json")

# Serve robots.txt
@app.get("/robots.txt")
async def get_robots():
    return FileResponse("robots.txt", media_type="text/plain")

# Serve sitemap.xml
@app.get("/sitemap.xml")
async def get_sitemap():
    return FileResponse("sitemap.xml", media_type="application/xml")

# Handle favicon
@app.get("/favicon.ico")
async def get_favicon():
    return FileResponse("static/icon-192x192.png")

# Serve custom CSS
@app.get("/static/css/custom.css")
async def get_custom_css():
    return FileResponse("static/css/custom.css", media_type="text/css")

# Handle font requests to prevent 404 errors
@app.get("/static/fonts/IBMPlexMono/IBMPlexMono-Regular.woff2")
async def get_font():
    return Response(content="", media_type="font/woff2")

# Mount Gradio app
app = gr.mount_gradio_app(app, iface, path="/")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=7862)
