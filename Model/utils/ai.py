import json

import google.generativeai as genai


def from_ai(model, img, predict1, predict2):
    try:
        print("Starting AI analysis...")
        image_file = genai.upload_file(path=img)
        print("Image uploaded to Gemini successfully")
        
        # Safely extract prediction data
        if predict2 and isinstance(predict2, dict):
            convnext_disease = predict2.get("disease", "unknown")
            convnext_disease_confidence = predict2.get("disease_confidence", "N/A")
            convnext_variety = predict2.get("variety", "unknown")
            convnext_variety_confidence = predict2.get("variety_confidence", "N/A")
        else:
            print("Warning: predict2 is not a valid dictionary, using defaults")
            convnext_disease = "unknown"
            convnext_disease_confidence = "N/A"
            convnext_variety = "unknown"
            convnext_variety_confidence = "N/A"
        
        prompt = f"""
        You are an advanced AI model designed to evaluate plant diseases through image analysis. Follow these steps to provide a response:

        1. **Image Validation**: 
           - First, assess whether the provided image contains a plant or any agricultural content. 
           - If the image is unclear, irrelevant (e.g., non-agricultural content), or not suitable for disease analysis, respond with a message indicating the image is not suitable and do not use the predictions from any disease detection models.

        2. **If the Image is Valid**:
           - Use the predictions from the disease detection models (if available) to provide the following information:
             - **crop_name**: The name of the crop based on the image, if detected.
             - **disease_name**: The disease detected from the image, if any.
             - **prevention**: Suggestions for treatment or prevention methods if a disease is detected, or general crop management tips if no disease is detected.

        3. **Model Predictions Available**:
           - ResNet9 prediction: {predict1}
           - Rice model disease: {convnext_disease} (confidence: {convnext_disease_confidence})
           - Rice model variety: {convnext_variety} (confidence: {convnext_variety_confidence})

        4. **Response Format**:
           - If the image is invalid, format your response in JSON with fields:
             - `"crop_name": "invalid"`
             - `"disease_name": "invalid"`
             - `"prevention": "The image provided is not suitable for analysis. Please provide a clearer image of a plant or crop for accurate evaluation."`

           - If the image is valid, format your response in JSON with fields:
             - `"crop_name"`: Name of the crop if detected, otherwise return `"unknown"`.
             - `"disease_name"`: Name of the disease if detected, otherwise return `"No disease detected"`.
             - `"prevention"`: Suggestions for treatment or prevention methods if a disease is found or general tips for crop management if no disease is detected.
        """

        print("Sending request to Gemini...")
        response = model.generate_content([prompt, image_file]).text
        print(f"Gemini response: {response}")
        
        genai.delete_file(image_file.name)
        print("Image file deleted from Gemini")

        res = json.loads(response)
        print(f"Parsed JSON: {res}")

        return res["crop_name"], res["disease_name"], res["prevention"]
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {response if 'response' in locals() else 'No response'}")
        return "Error", "JSON Parsing Failed", "The AI response could not be parsed. Please try again."
    except Exception as e:
        print(f"AI processing error: {e}")
        return "Error", "AI Processing Failed", f"An error occurred during AI analysis: {str(e)}"
