import json

import google.generativeai as genai


def from_ai(model, img, predict1, predict2, language='en'):
    try:
        print(f"Starting AI analysis with language: {language}")
        # Add timeout for file upload
        import time
        start_time = time.time()
        
        image_file = genai.upload_file(path=img)
        upload_time = time.time() - start_time
        print(f"Image uploaded to Gemini successfully in {upload_time:.2f} seconds")
        
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
        {lang_instruction}. You are an advanced AI model designed to evaluate plant diseases through image analysis. Follow these steps to provide a response:

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

        Important: Respond strictly in the language specified: {lang_instruction}. All field values should be in that language.
        """

        print("Sending request to Gemini...")
        # Add timeout for generation
        generation_start = time.time()
        response = model.generate_content([prompt, image_file]).text
        generation_time = time.time() - generation_start
        print(f"Gemini response received in {generation_time:.2f} seconds: {response[:100]}...")
        
        genai.delete_file(image_file.name)
        print("Image file deleted from Gemini")

        res = json.loads(response)
        print(f"Parsed JSON: {res}")

        return res["crop_name"], res["disease_name"], res["prevention"]
    except ConnectionError as e:
        print(f"Network connection error: {e}")
        return "Error", "Connection Failed", "Network connection error. Please check your internet connection."
    except TimeoutError as e:
        print(f"Request timeout error: {e}")
        return "Error", "Request Timeout", "The request timed out. Please try again."
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {response if 'response' in locals() else 'No response'}")
        return "Error", "JSON Parsing Failed", "The AI response could not be parsed. Please try again."
    except Exception as e:
        print(f"AI processing error: {e}")
        # Clean up file if it exists
        try:
            if 'image_file' in locals():
                genai.delete_file(image_file.name)
        except:
            pass
        return "Error", "AI Processing Failed", f"An error occurred during AI analysis: {str(e)}"