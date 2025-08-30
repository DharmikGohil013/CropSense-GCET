import os

import pandas as pd
import torch
import torch.nn.functional as F
from fastai.metrics import error_rate
from fastai.vision.all import *
from PIL import Image

# Load the DataFrame containing variety information
df = pd.read_csv("data/train.csv", index_col="image_id")


# Define get_variety function
def get_variety(p):
    return df.loc[p.name, "variety"]


# Define custom loss functions and metrics
def disease_loss(inp, disease, variety):
    return F.cross_entropy(inp[:, :10], disease)


def variety_loss(inp, disease, variety):
    return F.cross_entropy(inp[:, 10:], variety)


def combine_loss(inp, disease, variety):
    return disease_loss(inp, disease, variety) + variety_loss(inp, disease, variety)


def disease_err(inp, disease, variety):
    return error_rate(inp[:, :10], disease)


def variety_err(inp, disease, variety):
    return error_rate(inp[:, 10:], variety)


# Load the saved model
def load_rice_model(model_path):
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    import sys
    import pathlib
    try:
        # Patch PosixPath to WindowsPath if running on Windows
        if sys.platform.startswith('win'):
            pathlib.PosixPath = pathlib.WindowsPath
        learn = load_learner(model_path, cpu=torch.cuda.is_available() == False)
        return learn
    except Exception as e:
        raise RuntimeError(f"Error loading model: {str(e)}")


# Function to predict on a single image
def predict_rice(learn, img_path, resize=True):
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"Image file not found: {img_path}")

    try:
        img = PILImage.create(img_path)
    except Exception as e:
        raise ValueError(f"Error opening image: {str(e)}")

    # Resize image to 192x192 if resize is True
    if resize:
        if img.size != (192, 192):
            img = img.resize((192, 192), Image.LANCZOS)

    # Check if image is RGB
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Convert PIL Image to FastAI Image
    fastai_img = PILImage(img)

    try:
        # Get the DataLoaders object from the learner
        dls = learn.dls

        # Create a test DataLoader with a single image
        test_dl = dls.test_dl([fastai_img])

        # Get predictions
        preds, _ = learn.get_preds(dl=test_dl)

        # Apply softmax to get probabilities
        disease_probs = F.softmax(preds[0][:10], dim=0)
        variety_probs = F.softmax(preds[0][10:], dim=0)

        # Get the index of the highest probability for each category
        disease_pred = disease_probs.argmax().item()
        variety_pred = variety_probs.argmax().item()

        # Get the highest probability for each category
        disease_prob = disease_probs[disease_pred].item()
        variety_prob = variety_probs[variety_pred].item()

        # Convert numeric predictions to labels
        disease_label = dls.vocab[0][disease_pred]
        variety_label = dls.vocab[1][variety_pred]

        return {
            "disease": disease_label,
            "disease_confidence": f"{disease_prob:.2%}",
            "variety": variety_label,
            "variety_confidence": f"{variety_prob:.2%}",
        }
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        raise RuntimeError(f"Error during prediction: {str(e)}")