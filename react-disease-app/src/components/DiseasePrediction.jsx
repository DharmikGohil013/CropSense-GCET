import React, { useState } from 'react';
import axios from 'axios';
import './DiseasePrediction.css';

const DiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      // Make API call to your Python backend
      const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        setResult(response.data);
      } else {
        setError('No prediction data received');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      if (err.response) {
        setError(`Error: ${err.response.data.detail || 'Server error'}`);
      } else if (err.request) {
        setError('Network error: Could not connect to the server. Make sure the Python API is running on port 8000.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    // Reset file input
    const fileInput = document.getElementById('image-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="disease-prediction">
      <div className="container">
        <h1 className="title">Disease Prediction</h1>
        <p className="subtitle">Upload an image of a plant leaf to detect crop and disease information</p>
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="upload-section">
            <div className="file-input-wrapper">
              <input
                type="file"
                id="image-input"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="image-input" className="file-input-label">
                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Choose Image
              </label>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" className="preview-image" />
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button 
              type="submit" 
              disabled={!selectedImage || loading}
              className="predict-button"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Analyzing...
                </>
              ) : (
                'Predict Disease'
              )}
            </button>
            
            {(selectedImage || result || error) && (
              <button 
                type="button" 
                onClick={handleReset}
                className="reset-button"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}

        {result && (
          <div className="results-section">
            <h2 className="results-title">Prediction Results</h2>
            <div className="results-grid">
              <div className="result-card crop-card">
                <div className="result-label">Crop</div>
                <div className="result-value">{result.crop || result[0] || 'Unknown'}</div>
              </div>
              <div className="result-card disease-card">
                <div className="result-label">Disease</div>
                <div className="result-value">{result.disease || result[1] || 'Unknown'}</div>
              </div>
            </div>
            <div className="description-card">
              <div className="result-label">Description</div>
              <div className="result-description">
                {result.description || result[2] || 'No description available'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseasePrediction;
