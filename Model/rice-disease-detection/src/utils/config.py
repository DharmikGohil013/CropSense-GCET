import os

# Configuration settings for the application
class Config:
    GEMINI_API_KEY = "AIzaSyC5MTOY-TlP-EL39yMZhTk2dkGVbPRG5mw"
    WEATHER_API_KEY = "1e3e8f230b6064d27976e41163a82b77"
    MODEL_PATH = os.path.join("data", "models", "rice_model.pkl")
    TRAIN_CSV_PATH = os.path.join("data", "train.csv")
    IMAGE_SIZE = (192, 192)  # Size to which images will be resized
    BATCH_SIZE = 32  # Batch size for model predictions
    NUM_CLASSES_DISEASE = 10  # Number of disease classes
    NUM_CLASSES_VARIETY = 5  # Number of variety classes