import io
import os
import tempfile
import google.generativeai as genai
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import uvicorn
from dotenv import load_dotenv

load_dotenv()

# Import your existing functions
from app import disease_predict

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyC5M1ojFvSsYW9M0HjVpbTViwlezdzMBjU")
genai.configure(api_key=GEMINI_API_KEY)
solution_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config={
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }
)

# Create FastAPI app
api_app = FastAPI(title="Disease Prediction API")

# Add CORS middleware
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_solution(crop, disease, description):
    """Generate solution using Gemini AI"""
    try:
        if disease == "No disease detected" or disease == "unknown" or disease == "Error":
            return "No specific treatment needed. Continue regular crop management practices."
        
        prompt = f"""
        Based on the following crop disease information, provide a concise and practical solution:
        
        Crop: {crop}
        Disease: {disease}
        Description: {description}
        
        Please provide:
        1. Immediate treatment steps
        2. Prevention methods
        3. Recommended products or organic solutions
        4. Best practices for future prevention
        
        Keep the response concise but comprehensive, formatted as a clear actionable guide.
        """
        
        response = solution_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating solution: {str(e)}")
        return "Unable to generate solution at this time. Please consult with an agricultural expert."

@api_app.get("/")
async def root():
    return {"message": "Disease Prediction API is running"}

@api_app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read the image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Make prediction using your existing function
        crop, disease, description = disease_predict(image)
        
        # Generate solution using Gemini AI
        solution = generate_solution(crop, disease, description)
        
        # Return the results
        return JSONResponse(content={
            "crop": crop,
            "disease": disease,
            "description": description,
            "solution": solution,
            "status": "success"
        })
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(api_app, host="127.0.0.1", port=8000)
