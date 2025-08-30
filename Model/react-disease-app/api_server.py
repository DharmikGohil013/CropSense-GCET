import io
import os
import pickle
import tempfile
import json
from typing import Dict, Any
import sys
import pathlib

# Add the parent directory to the path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import rice functions with error handling
try:
    import rice_functions
    RICE_FUNCTIONS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import rice_functions: {e}")
    RICE_FUNCTIONS_AVAILABLE = False

import google.generativeai as genai
import numpy as np
import torch
from dotenv import load_dotenv
from PIL import Image
from torchvision import transforms
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from utils.ai import from_ai
from utils.disease import disease_classes
from utils.model import ResNet9
try:
    from utils.rice_model import load_rice_model, predict_rice
    RICE_MODEL_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import rice model utilities: {e}")
    RICE_MODEL_AVAILABLE = False
    
    # Define dummy functions
    def load_rice_model(path):
        return None
    
    def predict_rice(model, path):
        return {"disease": "Unknown", "disease_confidence": 0, "variety": "Unknown", "variety_confidence": 0}

# Load environment variables
load_dotenv()

# Set API keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDnrmfVIAvH9ZvQEQDdcExf995pbuQDvxc")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}
gemini_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash", 
    generation_config=generation_config
)

# Initialize FastAPI app
app = FastAPI(title="Disease Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # Allow all origins for development
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",  # Local Vite
        "http://10.10.5.33:5173",  # Your frontend URL
        "http://192.168.137.1:5173",  # Your PC IP with frontend port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
disease_model_path = "../models/disease_teller.pth"
rice_disease_model_path = "../models/rice_disease.pkl"

# Load disease detection model
try:
    disease_model = ResNet9(3, len(disease_classes))
    disease_model.load_state_dict(
        torch.load(disease_model_path, map_location=torch.device("cpu"), weights_only=True)
    )
    disease_model.eval()
    print("Disease model loaded successfully")
except Exception as e:
    print(f"Error loading disease model: {e}")
    disease_model = None

# Load rice model
try:
    if RICE_MODEL_AVAILABLE:
        rice_model = load_rice_model(rice_disease_model_path)
        print("Rice model loaded successfully")
    else:
        rice_model = None
        print("Rice model not available")
except Exception as e:
    print(f"Error loading rice model: {e}")
    rice_model = None

def predict_image(img, model=None):
    """Predict disease using ResNet9 model"""
    if model is None:
        return "Model not available"
    
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.ToTensor(),
    ])
    img_t = transform(img)
    img_u = torch.unsqueeze(img_t, 0)
    
    yb = model(img_u)
    _, preds = torch.max(yb, dim=1)
    prediction = disease_classes[preds[0].item()]
    return prediction

def generate_detailed_solution(crop_name: str, disease_name: str, description: str, language: str = 'en') -> str:
    """Generate detailed solution using Gemini AI in the specified language"""
    try:
        # Language mapping for better prompts
        language_prompts = {
            'en': 'Respond in English',
            'hi': 'Respond in Hindi (हिंदी में जवाब दें)',
            'gu': 'Respond in Gujarati (ગુજરાતીમાં જવાબ આપો)',
            'es': 'Respond in Spanish (Responde en español)',
            'fr': 'Respond in French (Répondez en français)',
            'de': 'Respond in German (Antworten Sie auf Deutsch)',
            'pt': 'Respond in Portuguese (Responda em português)',
            'zh': 'Respond in Chinese (用中文回答)',
            'ja': 'Respond in Japanese (日本語で答えてください)',
            'ko': 'Respond in Korean (한국어로 답변해주세요)',
            'ru': 'Respond in Russian (Отвечайте по-русски)',
            'ar': 'Respond in Arabic (أجب بالعربية)',
            'bn': 'Respond in Bengali (বাংলায় উত্তর দিন)',
            'ta': 'Respond in Tamil (தமிழில் பதில் அளிக்கவும்)',
            'te': 'Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి)',
            'ml': 'Respond in Malayalam (മലയാളത്തിൽ ഉത്തരം നൽകുക)',
            'kn': 'Respond in Kannada (ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ)',
            'pa': 'Respond in Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ)',
            'ur': 'Respond in Urdu (اردو میں جواب دیں)',
            'mr': 'Respond in Marathi (मराठीत उत्तर द्या)',
        }
        
        lang_instruction = language_prompts.get(language, 'Respond in English')
        
        solution_prompt = f"""
        {lang_instruction}. Based on the following crop disease information, provide a comprehensive solution in 2-3 sentences:
        
        Crop: {crop_name}
        Disease: {disease_name}
        Description: {description}
        
        Please provide:
        1. Immediate treatment steps
        2. Prevention measures for future
        3. Best practices for this specific crop-disease combination
        
        Keep the response concise but informative, focusing on practical actionable advice.
        Format as plain text, not JSON.
        """
        
        response = gemini_model.generate_content(solution_prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating solution: {e}")
        # Fallback solutions based on common diseases in the requested language
        fallback_solutions = {
            'en': {
                "early blight": "Apply copper-based fungicides every 7-14 days. Remove infected leaves immediately and ensure proper air circulation. Practice crop rotation with non-solanaceous crops for 2-3 years.",
                "late blight": "Use protective fungicides like chlorothalonil or copper sulfate. Avoid overhead watering and ensure good drainage. Remove and destroy infected plants immediately to prevent spread.",
                "bacterial spot": "Apply copper-based bactericides during dry weather. Avoid working in wet fields and use drip irrigation instead of overhead watering. Use disease-resistant varieties when available.",
                "leaf spot": "Apply appropriate fungicides based on the pathogen. Improve air circulation by proper spacing and pruning. Remove fallen leaves and practice good field sanitation.",
                "powdery mildew": "Apply sulfur-based fungicides or systemic fungicides like triazoles. Ensure good air circulation and avoid overhead watering. Remove infected plant parts immediately.",
                "default": f"For {disease_name} in {crop_name}, consult with local agricultural extension services for specific treatment recommendations. Practice good field hygiene, proper spacing, and consider using disease-resistant varieties."
            },
            'hi': {
                "early blight": "हर 7-14 दिन में तांबा आधारित कवकनाशी का छिड़काव करें। संक्रमित पत्तियों को तुरंत हटाएं और उचित हवा का संचार सुनिश्चित करें। 2-3 साल तक गैर-सोलानेसियस फसलों के साथ फसल चक्र का अभ्यास करें।",
                "late blight": "क्लोरोथालोनिल या कॉपर सल्फेट जैसे सुरक्षात्मक कवकनाशी का उपयोग करें। ऊपरी सिंचाई से बचें और अच्छी जल निकासी सुनिश्चित करें। फैलने से रोकने के लिए संक्रमित पौधों को तुरंत हटाएं और नष्ट करें।",
                "bacterial spot": "शुष्क मौसम में तांबा आधारित जीवाणुनाशी का प्रयोग करें। गीले खेतों में काम करने से बचें और ऊपरी सिंचाई के बजाय ड्रिप सिंचाई का उपयोग करें। उपलब्ध होने पर रोग प्रतिरोधी किस्मों का उपयोग करें।",
                "leaf spot": "रोगजनक के आधार पर उपयुक्त कवकनाशी का प्रयोग करें। उचित दूरी और छंटाई द्वारा हवा का संचार सुधारें। गिरी हुई पत्तियों को हटाएं और अच्छी खेत स्वच्छता का अभ्यास करें।",
                "powdery mildew": "सल्फर आधारित कवकनाशी या ट्राइएज़ोल जैसे सिस्टमिक कवकनाशी का प्रयोग करें। अच्छी हवा का संचार सुनिश्चित करें और ऊपरी सिंचाई से बचें। संक्रमित पौधे के हिस्सों को तुरंत हटाएं।",
                "default": f"{crop_name} में {disease_name} के लिए, विशिष्ट उपचार सिफारिशों के लिए स्थानीय कृषि विस्तार सेवाओं से सलाह लें। अच्छी खेत स्वच्छता, उचित दूरी, और रोग प्रतिरोधी किस्मों का उपयोग करने पर विचार करें।"
            },
            'gu': {
                "early blight": "દર 7-14 દિવસે તાંબા આધારિત ફૂગનાશકનો છંટકાવ કરો. ચેપગ્રસ્ત પાંદડાઓને તરત જ હટાવો અને યોગ્ય હવાનું પરિભ્રમણ સુનિશ્ચિત કરો. 2-3 વર્ષ માટે બિન-સોલેનેસિયસ પાકો સાથે પાક પરિભ્રમણ કરો.",
                "late blight": "ક્લોરોથાલોનિલ અથવા કોપર સલ્ફેટ જેવા સુરક્ષાત્મક ફૂગનાશકનો ઉપયોગ કરો. ઉપરથી પાણી આપવાનું ટાળો અને સારી ડ્રેનેજ સુનિશ્ચિત કરો. ફેલાવાને રોકવા માટે ચેપગ્રસ્ત છોડને તરત જ હટાવો અને નાશ કરો.",
                "bacterial spot": "શુષ્ક હવામાનમાં તાંબા આધારિત બેક્ટેરિયાનાશકનો ઉપયોગ કરો. ભીના ખેતરોમાં કામ કરવાનું ટાળો અને ઉપરથી પાણી આપવાને બદલે ડ્રિપ સિંચાઈનો ઉપયોગ કરો. ઉપલબ્ધ હોય ત્યારે રોગ પ્રતિરોધી જાતોનો ઉપયોગ કરો.",
                "leaf spot": "રોગકારક પર આધારિત યોગ્ય ફૂગનાશકનો ઉપયોગ કરો. યોગ્ય અંતર અને કાપણી દ્વારા હવાનું પરિભ્રમણ સુધારો. પડેલા પાંદડાઓને હટાવો અને સારી ખેત સ્વચ્છતાનો અભ્યાસ કરો.",
                "powdery mildew": "સલ્ફર આધારિત ફૂગનાશક અથવા ટ્રાયઝોલ જેવા સિસ્ટમિક ફૂગનાશકનો ઉપયોગ કરો. સારું હવાનું પરિભ્રમણ સુનિશ્ચિત કરો અને ઉપરથી પાણી આપવાનું ટાળો. ચેપગ્રસ્ત છોડના ભાગોને તરત જ હટાવો.",
                "default": f"{crop_name} માં {disease_name} માટે, ચોક્કસ સારવાર ભલામણો માટે સ્થાનિક કૃષિ વિસ્તરણ સેવાઓ સાથે સલાહ લો. સારી ખેત સ્વચ્છતા, યોગ્ય અંતર, અને રોગ પ્રતિરોધી જાતો વાપરવાનું વિચારો."
            }
        }
        
        # Get fallback solution based on language
        lang_solutions = fallback_solutions.get(language, fallback_solutions['en'])
        disease_lower = disease_name.lower()
        
        for key, solution in lang_solutions.items():
            if key != 'default' and key in disease_lower:
                return solution
        
        return lang_solutions.get('default', lang_solutions[list(lang_solutions.keys())[0]])

@app.get("/")
async def root():
    return {"message": "Disease Prediction API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "models_loaded": {
            "disease_model": disease_model is not None,
            "rice_model": rice_model is not None,
            "gemini_model": True
        }
    }

@app.post("/predict-fertilizer")
async def predict_fertilizer(request: Dict[str, Any]):
    """Predict fertilizer recommendation using Gemini AI"""
    try:
        # Extract form data
        nitrogen = request.get('nitrogen', 0)
        phosphorous = request.get('phosphorous', 0)
        potassium = request.get('potassium', 0)
        moisture = request.get('moisture', 0)
        soil_type = request.get('soilType', '')
        crop = request.get('crop', '')
        city = request.get('city', '')
        language = request.get('language', 'en')  # Get language preference
        
        # Validate required fields
        if not all([soil_type, crop]):
            raise HTTPException(status_code=400, detail="Missing required fields: soilType or crop")
        
        # Language-specific instruction for response
        language_instructions = {
            'en': "Please provide your response in English.",
            'hi': "कृपया अपना उत्तर हिंदी में दें।",
            'gu': "કૃપા કરીને તમારો જવાબ ગુજરાતીમાં આપો।"
        }
        
        lang_instruction = language_instructions.get(language, language_instructions['en'])
        
        # Create detailed prompt for Gemini to generate structured JSON response
        prompt = f"""As an agricultural expert, analyze the following soil and crop conditions and provide a fertilizer recommendation:

Soil Type: {soil_type}
Crop: {crop}
Location: {city if city else 'Not specified'}
Current Nitrogen Level: {nitrogen} kg/ha
Current Phosphorous Level: {phosphorous} kg/ha
Current Potassium Level: {potassium} kg/ha
Soil Moisture: {moisture}%

{lang_instruction}

Please provide a response in the following JSON format:
{{
    "fertilizerName": "specific fertilizer name/type",
    "explanation": "detailed explanation (2-3 sentences) of why this fertilizer is best for these conditions, considering the soil type, crop needs, and current nutrient levels",
    "applicationRate": "specific application rate and timing instructions"
}}

Consider the soil type characteristics, crop nutrient requirements, current nutrient deficiencies, and provide practical, actionable advice for farmers."""

        try:
            # Generate recommendation using Gemini
            response = gemini_model.generate_content(prompt)
            prediction_text = response.text.strip()
            
            # Try to parse as JSON
            try:
                prediction_json = json.loads(prediction_text)
                
                # Format response with fertilizerRecommendation structure
                fertilizer_recommendation = {
                    "fertilizerName": prediction_json.get("fertilizerName", "NPK 10-10-10"),
                    "explanation": prediction_json.get("explanation", "Balanced fertilizer recommended for general crop nutrition."),
                    "applicationRate": prediction_json.get("applicationRate", "Apply as per manufacturer instructions.")
                }
                
                return JSONResponse(content={
                    "success": True,
                    "fertilizerRecommendation": fertilizer_recommendation,
                    "timestamp": str(np.datetime64('now'))
                })
                
            except json.JSONDecodeError:
                # If JSON parsing fails, create structured response from text
                structured_response = parse_fertilizer_text_response(prediction_text, soil_type, crop, language)
                
                fertilizer_recommendation = {
                    "fertilizerName": structured_response.get("fertilizerName", "NPK 10-10-10"),
                    "explanation": structured_response.get("explanation", "Balanced fertilizer recommended for general crop nutrition."),
                    "applicationRate": structured_response.get("applicationRate", "Apply as per manufacturer instructions.")
                }
                
                return JSONResponse(content={
                    "success": True,
                    "fertilizerRecommendation": fertilizer_recommendation,
                    "timestamp": str(np.datetime64('now'))
                })
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            # Fallback recommendation based on soil type and crop
            fallback_recommendation = generate_structured_fertilizer_recommendation(
                soil_type, crop, nitrogen, phosphorous, potassium, moisture, language
            )
            
            fertilizer_recommendation = {
                "fertilizerName": fallback_recommendation.get("fertilizerName", "NPK 10-10-10"),
                "explanation": fallback_recommendation.get("explanation", "Balanced fertilizer recommended for general crop nutrition."),
                "applicationRate": fallback_recommendation.get("applicationRate", "Apply as per manufacturer instructions.")
            }
            
            return JSONResponse(content={
                "success": True,
                "fertilizerRecommendation": fertilizer_recommendation,
                "note": "Generated using expert system due to AI service unavailability",
                "timestamp": str(np.datetime64('now'))
            })
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in fertilizer prediction: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Internal server error during fertilizer prediction",
                "message": str(e)
            }
        )

def parse_fertilizer_text_response(text: str, soil_type: str, crop: str, language: str = 'en') -> Dict[str, str]:
    """Parse unstructured text response into structured format"""
    lines = text.split('\n')
    
    fertilizer_name = "NPK 10-10-10"
    explanation = f"Balanced fertilizer recommended for {crop} in {soil_type} soil."
    application_rate = "Apply as per manufacturer instructions."
    
    # Try to extract information from text
    for line in lines:
        line = line.strip()
        if any(keyword in line.lower() for keyword in ['fertilizer', 'npk', 'urea', 'phosphate']):
            if ':' in line:
                fertilizer_name = line.split(':', 1)[1].strip()
        elif any(keyword in line.lower() for keyword in ['apply', 'rate', 'dose', 'kg']):
            application_rate = line
    
    # Use the full text as explanation if no specific parts found
    if len(text.strip()) > 20:
        explanation = text.strip()
    
    return {
        "fertilizerName": fertilizer_name,
        "explanation": explanation,
        "applicationRate": application_rate
    }

def generate_structured_fertilizer_recommendation(soil_type: str, crop: str, n: float, p: float, k: float, moisture: float, language: str = 'en') -> Dict[str, str]:
    """Generate structured fertilizer recommendation based on expert rules"""
    
    # Basic NPK recommendations for common crops
    crop_requirements = {
        'rice': {'n': 120, 'p': 60, 'k': 40, 'fertilizer': 'NPK 20-10-10'},
        'wheat': {'n': 120, 'p': 60, 'k': 40, 'fertilizer': 'NPK 20-10-10'},
        'corn': {'n': 150, 'p': 75, 'k': 60, 'fertilizer': 'NPK 18-12-8'},
        'maize': {'n': 150, 'p': 75, 'k': 60, 'fertilizer': 'NPK 18-12-8'},
        'soybean': {'n': 20, 'p': 60, 'k': 120, 'fertilizer': 'NPK 5-15-20'},
        'cotton': {'n': 120, 'p': 60, 'k': 60, 'fertilizer': 'NPK 15-10-10'},
        'sugarcane': {'n': 150, 'p': 75, 'k': 75, 'fertilizer': 'NPK 16-12-12'},
        'tomato': {'n': 200, 'p': 100, 'k': 200, 'fertilizer': 'NPK 15-15-15'},
        'potato': {'n': 150, 'p': 100, 'k': 200, 'fertilizer': 'NPK 12-12-17'},
        'onion': {'n': 150, 'p': 75, 'k': 75, 'fertilizer': 'NPK 10-10-10'},
        'cabbage': {'n': 150, 'p': 100, 'k': 200, 'fertilizer': 'NPK 15-15-15'},
        'lettuce': {'n': 100, 'p': 50, 'k': 150, 'fertilizer': 'NPK 10-5-15'},
        'carrot': {'n': 100, 'p': 75, 'k': 125, 'fertilizer': 'NPK 8-8-12'}
    }
    
    crop_lower = crop.lower()
    req = crop_requirements.get(crop_lower, {'n': 120, 'p': 60, 'k': 60, 'fertilizer': 'NPK 10-10-10'})
    
    # Calculate deficiencies
    n_deficit = max(0, req['n'] - n)
    p_deficit = max(0, req['p'] - p)
    k_deficit = max(0, req['k'] - k)
    
    # Determine fertilizer based on deficiencies
    fertilizer = req['fertilizer']
    
    # Adjust for high deficiencies
    if n_deficit > 80:
        fertilizer = "Urea (46-0-0) + " + fertilizer
    elif p_deficit > 50:
        fertilizer = "Single Super Phosphate + " + fertilizer
    elif k_deficit > 80:
        fertilizer = "Muriate of Potash + " + fertilizer
    
    # Soil-specific adjustments
    soil_factors = {
        'sandy': {
            'adjustment': 'slow-release fertilizer',
            'reason': 'sandy soil drains quickly and nutrients can leach away easily'
        },
        'clay': {
            'adjustment': 'split application',
            'reason': 'clay soil has poor drainage and nutrients can become locked up'
        },
        'loamy': {
            'adjustment': 'standard application',
            'reason': 'loamy soil has good nutrient retention and drainage'
        },
        'silty': {
            'adjustment': 'careful moisture management',
            'reason': 'silty soil can become waterlogged affecting nutrient uptake'
        },
        'peaty': {
            'adjustment': 'reduced nitrogen',
            'reason': 'peaty soil is rich in organic matter providing natural nitrogen'
        },
        'chalky': {
            'adjustment': 'acidifying fertilizer',
            'reason': 'chalky soil is alkaline and can lock up nutrients'
        }
    }
    
    soil_info = soil_factors.get(soil_type.lower(), soil_factors['loamy'])
    
    # Generate explanation
    explanation = f"Given the {soil_type} soil with current nutrient levels (N:{n}, P:{p}, K:{k}) and {moisture}% moisture content, {fertilizer} is recommended for {crop}. This formulation addresses the specific nutrient deficiencies while considering that {soil_info['reason']}."
    
    # Generate application rate
    base_rate = 25 if crop_lower in ['rice', 'wheat'] else 30 if crop_lower in ['corn', 'maize'] else 20
    
    if soil_type.lower() == 'sandy':
        application_rate = f"Apply {base_rate}-{base_rate+10} kg per acre in 3-4 split doses to prevent leaching. First application at planting, then every 3-4 weeks during growing season."
    elif soil_type.lower() == 'clay':
        application_rate = f"Apply {base_rate-5}-{base_rate} kg per acre in 2-3 split doses. Ensure proper drainage before application for better nutrient uptake."
    else:
        application_rate = f"Apply {base_rate} kg per acre at planting, followed by {base_rate//2} kg per acre after 4-6 weeks. Adjust based on soil test results if available."
    
    return {
        "fertilizerName": fertilizer,
        "explanation": explanation,
        "applicationRate": application_rate
    }
    """Generate fallback fertilizer recommendation based on basic rules"""
    
    # Basic NPK recommendations for common crops
    crop_requirements = {
        'rice': {'n': 120, 'p': 60, 'k': 40},
        'wheat': {'n': 120, 'p': 60, 'k': 40},
        'corn': {'n': 150, 'p': 75, 'k': 60},
        'soybean': {'n': 20, 'p': 60, 'k': 120},
        'cotton': {'n': 120, 'p': 60, 'k': 60},
        'sugarcane': {'n': 150, 'p': 75, 'k': 75},
        'tomato': {'n': 200, 'p': 100, 'k': 200},
        'potato': {'n': 150, 'p': 100, 'k': 200},
        'onion': {'n': 150, 'p': 75, 'k': 75},
        'cabbage': {'n': 150, 'p': 100, 'k': 200},
        'lettuce': {'n': 100, 'p': 50, 'k': 150},
        'carrot': {'n': 100, 'p': 75, 'k': 125}
    }
    
    crop_lower = crop.lower()
    req = crop_requirements.get(crop_lower, {'n': 120, 'p': 60, 'k': 60})
    
    # Calculate deficiencies
    n_deficit = max(0, req['n'] - n)
    p_deficit = max(0, req['p'] - p)
    k_deficit = max(0, req['k'] - k)
    
    recommendations = []
    
    # NPK recommendations
    if n_deficit > 50:
        recommendations.append("High nitrogen fertilizer (Urea 46-0-0)")
    elif n_deficit > 20:
        recommendations.append("Balanced NPK fertilizer (20-10-10)")
    
    if p_deficit > 30:
        recommendations.append("Phosphate fertilizer (Single Super Phosphate)")
    
    if k_deficit > 30:
        recommendations.append("Potash fertilizer (Muriate of Potash)")
    
    # Soil type specific recommendations
    soil_recommendations = {
        'sandy': "Use slow-release fertilizers to prevent leaching",
        'clay': "Apply fertilizer in split doses for better absorption",
        'loamy': "Standard fertilizer application methods work well",
        'silty': "Ensure good drainage before fertilizer application",
        'peaty': "Reduce nitrogen application as organic matter provides natural N",
        'chalky': "Use acidifying fertilizers to improve nutrient uptake"
    }
    
    soil_advice = soil_recommendations.get(soil_type.lower(), "Follow standard fertilizer practices")
    
    if not recommendations:
        recommendations.append(f"Balanced NPK fertilizer (10-10-10) for {crop}")
    
    return f"""**Recommended Fertilizer:** {', '.join(recommendations)}

**Application:** Apply {soil_advice.lower()}. For {crop} in {soil_type} soil, apply fertilizer in 2-3 split doses during the growing season.

**Soil Specific Advice:** {soil_advice}"""


@app.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...), language: str = Form('en')):
    """Predict disease from uploaded image"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
            image.save(temp_file.name)
            temp_path = temp_file.name
        
        try:
            print(f"Starting disease prediction with language: {language}")
            
            # Get prediction from ResNet9 model
            if disease_model is not None:
                resnet_prediction = predict_image(image, disease_model)
                print(f"ResNet9 prediction: {resnet_prediction}")
            else:
                resnet_prediction = "Model not available"
                print("Disease model not available")
            
            # Get prediction from rice model
            if rice_model is not None:
                rice_prediction = predict_rice(rice_model, temp_path)
                print(f"Rice model prediction: {rice_prediction}")
            else:
                rice_prediction = {"disease": "Unknown", "disease_confidence": 0}
                print("Rice model not available")
            
            # Get AI analysis using Gemini with language support
            try:
                ai_result = from_ai(gemini_model, temp_path, resnet_prediction, rice_prediction, language)
                print(f"AI analysis result: {ai_result}")
            except Exception as e:
                print(f"Gemini AI error: {e}")
                ai_result = ("Unknown", resnet_prediction, "AI analysis unavailable")
            
            if isinstance(ai_result, tuple) and len(ai_result) == 3:
                crop_name, disease_name, description = ai_result
            else:
                crop_name = "Unknown"
                disease_name = resnet_prediction if resnet_prediction else "Unknown Disease"
                description = "Disease detected but detailed analysis unavailable."
            
            # Generate solution using Gemini with language support
            solution = generate_detailed_solution(crop_name, disease_name, description, language)
            
            # Calculate confidence (mock for now, can be improved)
            confidence = 85 if disease_name != "Unknown Disease" else 60
            
            # Determine severity based on disease name
            severity = "Moderate"
            if any(critical in disease_name.lower() for critical in ["blight", "rot", "wilt"]):
                severity = "High"
            elif any(mild in disease_name.lower() for mild in ["spot", "mildew"]):
                severity = "Low"
            
            response_data = {
                "success": True,
                "crop": crop_name,
                "disease": disease_name,
                "description": description,
                "solution": solution,
                "confidence": confidence,
                "severity": severity,
                "timestamp": str(np.datetime64('now'))
            }
            
            return JSONResponse(content=response_data)
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_path)
            except:
                pass
                
    except Exception as e:
        print(f"Error in disease prediction: {e}")
        raise HTTPException(
            status_code=500, 
            detail={
                "success": False,
                "error": "Internal server error during prediction",
                "message": str(e)
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
