import cv2
import numpy as np

def resize_image(image, target_size=(192, 192)):
    return cv2.resize(image, target_size, interpolation=cv2.INTER_LANCZOS4)

def normalize_image(image):
    image = image.astype(np.float32) / 255.0
    return image

def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image at path {image_path} could not be loaded.")
    
    image = resize_image(image)
    image = normalize_image(image)
    return image

def convert_to_tensor(image):
    image = np.transpose(image, (2, 0, 1))  # Change from HWC to CHW format
    return torch.tensor(image).unsqueeze(0)  # Add batch dimension