import os
import pytest
import pandas as pd
from fastai.vision.all import *
from src.models.rice_model import load_rice_model, predict_rice

# Test configuration
MODEL_PATH = "data/models/rice_model.pkl"
TEST_IMAGE_PATH = "path/to/test/image.jpg"  # Update with a valid test image path

# Load the model for testing
@pytest.fixture(scope="module")
def model():
    return load_rice_model(MODEL_PATH)

# Test prediction function
def test_predict_rice(model):
    result = predict_rice(model, TEST_IMAGE_PATH)
    assert "disease" in result
    assert "variety" in result
    assert isinstance(result["disease"], str)
    assert isinstance(result["variety"], str)
    assert isinstance(result["disease_confidence"], str)
    assert isinstance(result["variety_confidence"], str)

# Test loading model
def test_load_rice_model():
    assert os.path.exists(MODEL_PATH)
    model = load_rice_model(MODEL_PATH)
    assert model is not None

# Test error handling for invalid image path
def test_predict_rice_invalid_image(model):
    with pytest.raises(FileNotFoundError):
        predict_rice(model, "invalid/path/to/image.jpg")