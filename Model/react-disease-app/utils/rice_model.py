import pickle
import numpy as np
from PIL import Image
import os

def load_rice_model(model_path):
    """
    Load the rice disease detection model
    
    Args:
        model_path: Path to the pickled rice model
    
    Returns:
        Loaded model or None if loading fails
    """
    try:
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
            print(f"Rice model loaded successfully from {model_path}")
            return model
        else:
            print(f"Rice model file not found: {model_path}")
            return None
    except Exception as e:
        print(f"Error loading rice model: {e}")
        return None

def predict_rice(model, image_path):
    """
    Predict rice disease and variety from image
    
    Args:
        model: Loaded rice model
        image_path: Path to the image file
    
    Returns:
        Dictionary with disease and variety predictions
    """
    try:
        if model is None:
            return {
                "disease": "Unknown",
                "disease_confidence": 0,
                "variety": "Unknown", 
                "variety_confidence": 0
            }
        
        # Load and preprocess image
        image = Image.open(image_path).convert('RGB')
        
        # Resize image to expected input size (adjust based on your model)
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize
        img_array = np.array(image)
        img_array = img_array / 255.0
        
        # Reshape for model input (add batch dimension)
        img_array = img_array.reshape(1, -1)  # Flatten for traditional ML models
        
        # Make prediction
        try:
            prediction = model.predict(img_array)
            
            # Handle different model output formats
            if hasattr(model, 'predict_proba'):
                probabilities = model.predict_proba(img_array)
                confidence = np.max(probabilities)
            else:
                confidence = 0.8  # Default confidence
            
            # Map prediction to disease names (adjust based on your model)
            disease_classes = [
                "Healthy",
                "Brown Spot",
                "Hispa",
                "Leaf Blast",
                "Leaf Scald",
                "Leaf Smut",
                "Narrow Brown Spot",
                "Rice Tungro",
                "Sheath Blight",
                "Sheath Rot"
            ]
            
            if isinstance(prediction, (list, np.ndarray)) and len(prediction) > 0:
                pred_index = int(prediction[0]) if hasattr(prediction[0], '__int__') else 0
                if 0 <= pred_index < len(disease_classes):
                    disease_name = disease_classes[pred_index]
                else:
                    disease_name = "Unknown"
            else:
                disease_name = "Unknown"
            
            return {
                "disease": disease_name,
                "disease_confidence": float(confidence * 100),
                "variety": "Unknown",  # Add variety detection if available
                "variety_confidence": 0
            }
            
        except Exception as e:
            print(f"Error during rice model prediction: {e}")
            return {
                "disease": "Unknown",
                "disease_confidence": 0,
                "variety": "Unknown",
                "variety_confidence": 0
            }
            
    except Exception as e:
        print(f"Error in predict_rice function: {e}")
        return {
            "disease": "Unknown",
            "disease_confidence": 0,
            "variety": "Unknown",
            "variety_confidence": 0
        }

def preprocess_rice_image(image_path, target_size=(224, 224)):
    """
    Preprocess image for rice model prediction
    
    Args:
        image_path: Path to image file
        target_size: Target size for resizing
    
    Returns:
        Preprocessed image array
    """
    try:
        image = Image.open(image_path).convert('RGB')
        image = image.resize(target_size)
        img_array = np.array(image) / 255.0
        return img_array
    except Exception as e:
        print(f"Error preprocessing rice image: {e}")
        return None