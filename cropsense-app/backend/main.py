import os
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import google.generativeai as genai
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Crop Disease Detection API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fixed label mapping as specified
LABEL_MAPPING = {
    "0": "Cassava Bacterial Blight (CBB)",
    "1": "Cassava Brown Streak Disease (CBSD)",
    "2": "Cassava Green Mottle (CGM)",
    "3": "Cassava Mosaic Disease (CMD)",
    "4": "Healthy"
}

# Global variables for model
model = None
MODEL_PATH = r"c:\Users\dharm\Downloads\crop_disease_model_final.h5"

# Configure Gemini API
def configure_gemini():
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables")
            return False
        genai.configure(api_key=api_key)
        return True
    except Exception as e:
        logger.error(f"Failed to configure Gemini API: {e}")
        return False

def load_model():
    """Load the TensorFlow model"""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
            logger.info(f"Model loaded successfully from {MODEL_PATH}")
            logger.info(f"Model input shape: {model.input_shape}")
            return True
        else:
            logger.error(f"Model file not found at {MODEL_PATH}")
            return False
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return False

def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image for model prediction"""
    try:
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size (assuming 224x224 based on common models)
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize to [0,1]
        image_array = np.array(image)
        image_array = image_array.astype(np.float32) / 255.0
        
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    except Exception as e:
        logger.error(f"Failed to preprocess image: {e}")
        raise HTTPException(status_code=400, detail=f"Image preprocessing failed: {str(e)}")

async def get_gemini_description(disease_label: str) -> str:
    """Get farmer-friendly description from Gemini API"""
    try:
        if not configure_gemini():
            return "AI description temporarily unavailable. Please consult with agricultural experts for detailed guidance."
        
        prompt = f"""You are an agriculture expert. Explain the following crop condition to a farmer in simple, practical language (~180 words).

Disease/Status: {disease_label}

Include:
- 2–3 key symptoms
- Likely cause
- Immediate actions today (home/low-cost)
- Recommended treatment (generic names)
- Preventive tips for next season

Format in concise bullet points. Avoid jargon."""

        model_gemini = genai.GenerativeModel('gemini-1.5-flash')
        response = model_gemini.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Failed to get Gemini description: {e}")
        return f"AI analysis indicates: {disease_label}. Please consult with agricultural experts for detailed treatment recommendations."

@app.on_event("startup")
async def startup_event():
    """Initialize model and APIs on startup"""
    logger.info("Starting Crop Disease Detection API...")
    
    if not load_model():
        logger.error("Failed to load model. API will not function properly.")
    
    configure_gemini()
    logger.info("API startup complete")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Crop Disease Detection API", 
        "status": "running",
        "model_loaded": model is not None
    }

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """Predict crop disease from uploaded image"""
    
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please check server logs.")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Preprocess image
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(processed_image)
        predictions = predictions[0]  # Remove batch dimension
        
        # Get top 3 predictions
        top_indices = np.argsort(predictions)[::-1][:3]
        
        # Create top-k results
        topk_results = []
        for i, idx in enumerate(top_indices):
            confidence = float(predictions[idx])
            label = LABEL_MAPPING[str(idx)]
            topk_results.append({
                "index": int(idx),
                "label": label,
                "confidence": round(confidence, 4)
            })
        
        # Get primary prediction
        primary_idx = top_indices[0]
        primary_label = LABEL_MAPPING[str(primary_idx)]
        
        # Get Gemini description
        description = await get_gemini_description(primary_label)
        
        logger.info(f"Prediction completed. Primary: {primary_label}, Confidence: {predictions[primary_idx]:.4f}")
        
        return {
            "ok": True,
            "primary_label": primary_label,
            "topk": topk_results,
            "description": description
        }
        
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "model_exists": os.path.exists(MODEL_PATH),
        "gemini_configured": configure_gemini()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
