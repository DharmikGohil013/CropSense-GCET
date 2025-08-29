import React, { useState } from 'react';
import axios from 'axios';
import './FertilizerPrediction.css';

const FertilizerPrediction = () => {
  const [formData, setFormData] = useState({
    nitrogen: 0,
    phosphorous: 0,
    potassium: 0,
    moisture: 0,
    soilType: '',
    crop: '',
    city: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const soilTypes = [
    'Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty', 'Chalky'
  ];

  const crops = [
    'Rice', 'Wheat', 'Corn', 'Soybean', 'Cotton', 'Sugarcane', 
    'Tomato', 'Potato', 'Onion', 'Cabbage', 'Lettuce', 'Carrot'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nitrogen' || name === 'phosphorous' || name === 'potassium' || name === 'moisture' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleClear = () => {
    setFormData({
      nitrogen: 0,
      phosphorous: 0,
      potassium: 0,
      moisture: 0,
      soilType: '',
      crop: '',
      city: ''
    });
    setPrediction(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.soilType || !formData.crop || !formData.city) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/predict-fertilizer', formData);
      setPrediction(response.data.prediction);
    } catch (err) {
      setError('Failed to get fertilizer prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fertilizer-prediction">
      <div className="prediction-container">
        <div className="prediction-header">
          <h1>🌱 Fertilizer Prediction</h1>
          <p>Get AI-powered fertilizer recommendations for your crops</p>
        </div>

        <div className="prediction-content">
          <div className="input-section">
            <h3>📊 Soil & Crop Information</h3>
            <form onSubmit={handleSubmit} className="prediction-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nitrogen">Nitrogen (N)</label>
                  <input
                    type="number"
                    id="nitrogen"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleInputChange}
                    min="0"
                    max="200"
                    step="0.1"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phosphorous">Phosphorous (P)</label>
                  <input
                    type="number"
                    id="phosphorous"
                    name="phosphorous"
                    value={formData.phosphorous}
                    onChange={handleInputChange}
                    min="0"
                    max="150"
                    step="0.1"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="potassium">Potassium (K)</label>
                  <input
                    type="number"
                    id="potassium"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleInputChange}
                    min="0"
                    max="200"
                    step="0.1"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="moisture">Moisture (%)</label>
                  <input
                    type="number"
                    id="moisture"
                    name="moisture"
                    value={formData.moisture}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="soilType">Soil Type</label>
                  <select
                    id="soilType"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Soil Type</option>
                    {soilTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="crop">Crop</label>
                  <select
                    id="crop"
                    name="crop"
                    value={formData.crop}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Crop</option>
                    {crops.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleClear} className="clear-btn">
                  Clear
                </button>
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Analyzing...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="error-section">
              <p className="error-message">❌ {error}</p>
            </div>
          )}

          {prediction && (
            <div className="results-section">
              <h3>🎯 Fertilizer Recommendation</h3>
              <div className="prediction-result">
                <div className="result-card">
                  <h4>Recommended Fertilizer</h4>
                  <p className="fertilizer-name">{prediction}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FertilizerPrediction;
