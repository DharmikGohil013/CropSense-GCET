import os
import sys

import pandas as pd
import torch
import torch.nn.functional as F
from fastai.metrics import error_rate
from fastai.vision.all import *
from packaging import version
from PIL import Image

# Load the DataFrame containing variety information
# Get the path to the parent directory (Model folder)
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
train_csv_path = os.path.join(current_dir, "train.csv")

try:
    df = pd.read_csv(train_csv_path, index_col="image_id")
except FileNotFoundError:
    print(f"Warning: train.csv not found at {train_csv_path}")
    # Create a dummy DataFrame if train.csv doesn't exist
    df = pd.DataFrame({'variety': ['variety1', 'variety2']}, index=['img1', 'img2'])


def _ensure_fastai_legacy_shims():
    """Ensure fastai exports saved with fastcore<1.6 load under fastai>=2.8."""
    try:
        import fastai
    except ImportError:
        return
    if version.parse(fastai.__version__) < version.parse("2.8.0"):
        return
    existing_transform = sys.modules.get("fastcore.transform")
    existing_dispatch = sys.modules.get("fastcore.dispatch")
    if (
        existing_transform is not None
        and hasattr(existing_transform, "Pipeline")
        and existing_dispatch is not None
        and hasattr(existing_dispatch, "TypeDispatch")
    ):
        return
    from utils import legacy_fastcore_dispatch as legacy_dispatch
    from utils import legacy_fastcore_transform as legacy_transform

    legacy_dispatch.__name__ = "fastcore.dispatch"
    legacy_dispatch.__package__ = "fastcore"
    legacy_transform.__name__ = "fastcore.transform"
    legacy_transform.__package__ = "fastcore"

    sys.modules["fastcore.dispatch"] = legacy_dispatch
    sys.modules["fastcore.transform"] = legacy_transform

    try:
        import fastcore

        fastcore.dispatch = legacy_dispatch
        fastcore.transform = legacy_transform
    except ImportError:
        pass


# Define get_variety function
def get_variety(p):
    try:
        return df.loc[p.name, "variety"]
    except (KeyError, AttributeError):
        return "unknown_variety"


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
    import builtins
    
    try:
        # Patch PosixPath to WindowsPath if running on Windows
        if sys.platform.startswith('win'):
            pathlib.PosixPath = pathlib.WindowsPath
        
        # Make custom functions available globally for model loading
        builtins.get_variety = get_variety
        builtins.disease_loss = disease_loss
        builtins.variety_loss = variety_loss
        builtins.combine_loss = combine_loss
        builtins.disease_err = disease_err
        builtins.variety_err = variety_err
        builtins.df = df
        
        # Add them to the current module's globals as well
        globals()['get_variety'] = get_variety
        globals()['disease_loss'] = disease_loss
        globals()['variety_loss'] = variety_loss
        globals()['combine_loss'] = combine_loss
        globals()['disease_err'] = disease_err
        globals()['variety_err'] = variety_err
        globals()['df'] = df
        
        _ensure_fastai_legacy_shims()
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
        test_dl = dls.test_dl([fastai_img], bs=1, num_workers=0, shuffle=False, pin_memory=False, persistent_workers=False)

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

