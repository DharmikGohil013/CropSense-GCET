import json
import google.generativeai as genai
from PIL import Image

def from_ai(model, image_path, resnet_prediction, rice_prediction):
    """
    Analyze image using Gemini AI and return crop, disease, and description
    
    Args:
        model: Gemini model instance
        image_path: Path to the image file
        resnet_prediction: Prediction from ResNet9 model
        rice_prediction: Prediction from rice model (dict with disease info)
    
    Returns:
        Tuple of (crop_name, disease_name, description)
    """
    try:
        # Open and process the image
        image = Image.open(image_path)
        
        # Create prompt for Gemini
        prompt = f"""
        Analyze this plant/crop leaf image and provide a detailed assessment.
        
        Additional context:
        - ResNet9 model prediction: {resnet_prediction}
        - Rice model prediction: {rice_prediction}
        
        Please provide a response in the following JSON format:
        {{
            "crop_name": "name of the crop/plant",
            "disease_name": "specific disease name if any, or 'Healthy' if no disease",
            "description": "detailed description of the crop condition, disease symptoms if present, and analysis"
        }}
        
        Focus on:
        1. Identifying the crop type
        2. Detecting any visible diseases or health issues
        3. Describing symptoms and severity
        4. Consider the AI model predictions provided as context
        
        Be specific and provide actionable information for farmers.
        """
        
        # Generate content with image and prompt
        response = model.generate_content([prompt, image])
        
        # Parse the response
        try:
            # Try to parse as JSON
            result = json.loads(response.text.strip())
            return (
                result.get("crop_name", "Unknown Crop"),
                result.get("disease_name", "Unknown Disease"),
                result.get("description", "Analysis unavailable")
            )
        except json.JSONDecodeError:
            # If JSON parsing fails, extract information from text
            text = response.text.strip()
            
            # Simple text parsing fallback
            crop_name = "Unknown Crop"
            disease_name = resnet_prediction if resnet_prediction else "Unknown Disease"
            description = text if text else "AI analysis completed but detailed information unavailable."
            
            # Try to extract crop name from text
            text_lower = text.lower()
            common_crops = ["rice", "wheat", "corn", "maize", "potato", "tomato", "apple", "grape", "cotton", "soybean"]
            for crop in common_crops:
                if crop in text_lower:
                    crop_name = crop.capitalize()
                    break
            
            # Try to extract disease from text
            if "healthy" in text_lower or "no disease" in text_lower:
                disease_name = "Healthy"
            elif any(disease_word in text_lower for disease_word in ["blight", "spot", "rust", "rot", "mildew", "scab"]):
                # Extract disease from text if possible
                disease_words = ["blight", "spot", "rust", "rot", "mildew", "scab", "leaf", "bacterial", "fungal"]
                found_diseases = [word for word in disease_words if word in text_lower]
                if found_diseases:
                    disease_name = " ".join(found_diseases).title()
            
            return (crop_name, disease_name, description)
            
    except Exception as e:
        print(f"Error in AI analysis: {e}")
        # Fallback response
        crop_name = "Unknown Crop"
        disease_name = resnet_prediction if resnet_prediction else "Unknown Disease"
        description = f"AI analysis encountered an error: {str(e)}. Using model predictions as fallback."
        
        return (crop_name, disease_name, description)

def analyze_with_fallback(resnet_prediction, rice_prediction):
    """
    Provide analysis when AI is not available
    """
    # Extract crop from ResNet prediction
    crop_name = "Unknown Crop"
    disease_name = resnet_prediction if resnet_prediction else "Unknown Disease"
    
    # Try to parse ResNet prediction for crop info
    if resnet_prediction:
        prediction_parts = resnet_prediction.split('___')
        if len(prediction_parts) >= 2:
            crop_name = prediction_parts[0].replace('_', ' ').title()
            disease_part = prediction_parts[1].replace('_', ' ').title()
            if disease_part.lower() != 'healthy':
                disease_name = disease_part
            else:
                disease_name = "Healthy"
    
    # Use rice model data if available
    if isinstance(rice_prediction, dict) and rice_prediction.get('disease'):
        rice_disease = rice_prediction.get('disease', '')
        if rice_disease and rice_disease != 'Unknown':
            disease_name = rice_disease
            crop_name = "Rice"
    
    description = f"Automated analysis detected {crop_name} with {disease_name}. Manual verification recommended for accurate diagnosis."
    
    return (crop_name, disease_name, description)