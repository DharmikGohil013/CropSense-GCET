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
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:5173"],
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
MODEL_PATHS = [
    "crop_disease_model_final.h5",  # Backend directory (preferred)
    r"c:\Users\dharm\Downloads\crop_disease_model_final.h5"  # Original location
]

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
    """Load the TensorFlow model with better error handling"""
    global model
    
    # Try each model path
    for model_path in MODEL_PATHS:
        try:
            # Check if model file exists
            if not os.path.exists(model_path):
                logger.info(f"Model not found at {model_path}")
                continue
            
            logger.info(f"Attempting to load model from {model_path}")
            
            # Try to load the model with custom objects if needed
            try:
                model = tf.keras.models.load_model(model_path, compile=False)
                logger.info(f"Model loaded successfully from {model_path}")
                logger.info(f"Model input shape: {model.input_shape}")
                
                # Test model with dummy input to ensure it works
                dummy_input = np.random.random((1, 224, 224, 3)).astype(np.float32)
                test_prediction = model.predict(dummy_input, verbose=0)
                logger.info(f"Model test successful. Output shape: {test_prediction.shape}")
                
                return True
                
            except Exception as model_error:
                logger.error(f"Model architecture error at {model_path}: {model_error}")
                continue
                
        except Exception as e:
            logger.error(f"Failed to load model from {model_path}: {e}")
            continue
    
    # If we get here, no model could be loaded
    logger.error("No valid model found in any of the specified paths")
    logger.warning("API will run without model - using mock data for testing")
    logger.info("Please ensure crop_disease_model_final.h5 is in the backend directory")
    model = None
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

@app.post("/analyze-disease")
async def analyze_disease(file: UploadFile = File(...)):
    """Analyze crop disease from uploaded image"""
    
    # Record start time for processing time calculation
    import time
    start_time = time.time()
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # If model is not loaded, return mock data for testing
        if model is None:
            logger.warning("Model not loaded, returning mock data for testing")
            processing_time = time.time() - start_time
            
            return {
                "top_prediction": {
                    "label": "Cassava Bacterial Blight (CBB)",
                    "confidence": 0.85
                },
                "all_predictions": [
                    {"label": "Cassava Bacterial Blight (CBB)", "confidence": 0.85},
                    {"label": "Cassava Mosaic Disease (CMD)", "confidence": 0.12},
                    {"label": "Healthy", "confidence": 0.03}
                ],
                "processing_time": processing_time,
                "gemini_description": "This appears to be Cassava Bacterial Blight (CBB). Key symptoms: Dark, water-soaked lesions on leaves and stems. Cause: Bacterial infection spread by wind and rain. Immediate actions: Remove affected plants, improve drainage. Treatment: Apply copper-based bactericides. Prevention: Use resistant varieties, avoid overhead watering, maintain field hygiene."
            }
        
        # Preprocess image
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(processed_image)
        predictions = predictions[0]  # Remove batch dimension
        
        # Get top 3 predictions
        top_indices = np.argsort(predictions)[::-1][:3]
        
        # Create all predictions results
        all_predictions = []
        for i, idx in enumerate(top_indices):
            confidence = float(predictions[idx])
            label = LABEL_MAPPING[str(idx)]
            all_predictions.append({
                "label": label,
                "confidence": round(confidence, 4)
            })
        
        # Get top prediction
        top_prediction = all_predictions[0]
        
        # Get Gemini description
        description = await get_gemini_description(top_prediction["label"])
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        logger.info(f"Analysis completed. Primary: {top_prediction['label']}, Confidence: {top_prediction['confidence']}")
        
        return {
            "top_prediction": top_prediction,
            "all_predictions": all_predictions,
            "processing_time": processing_time,
            "gemini_description": description
        }
        
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/predict")  
async def predict_disease_legacy(file: UploadFile = File(...)):
    """Legacy endpoint for backwards compatibility"""
    return await analyze_disease(file)

@app.get("/health")
async def health_check():
    """Detailed health check"""
    model_info = []
    for path in MODEL_PATHS:
        model_info.append({
            "path": path,
            "exists": os.path.exists(path)
        })
    
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_paths": model_info,
        "gemini_configured": configure_gemini()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
