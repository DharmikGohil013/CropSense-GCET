import React, { useState, useEffect } from 'react';
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
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  const WEATHER_API_KEY = '1e3e8f230b6064d27976e41163a82b77';
  const GEMINI_API_KEY = 'AIzaSyBQqOMAiwBjcLq0Kpf_CR8vdib8f7lOmZg';

  const soilTypes = [
    'Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty', 'Chalky'
  ];

  const crops = [
    'Rice', 'Wheat', 'Corn', 'Soybean', 'Cotton', 'Sugarcane', 
    'Tomato', 'Potato', 'Onion', 'Cabbage', 'Lettuce', 'Carrot'
  ];

  // Function to get weather data including humidity/moisture
  const getWeatherData = async (cityName) => {
    if (!cityName || cityName.trim() === '') {
      setWeatherError('District name is required to fetch weather data');
      return;
    }

    setWeatherLoading(true);
    setWeatherError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('District not found. Please check the district name.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key');
        } else {
          throw new Error('Failed to fetch weather data');
        }
      }

      const data = await response.json();
      
      // Extract humidity (moisture) from weather data
      const humidity = data.main?.humidity;
      
      if (humidity !== undefined) {
        setFormData(prev => ({
          ...prev,
          moisture: humidity
        }));
        setWeatherError('');
      } else {
        setWeatherError('Humidity data not available for this district');
      }
    } catch (error) {
      setWeatherError(error.message);
      console.error('Weather API error:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          await getCityFromCoordinates(latitude, longitude);
        } catch (error) {
          setLocationError('Failed to get location details');
          console.error('Location error:', error);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Failed to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Function to get city name from coordinates using reverse geocoding
  const getCityFromCoordinates = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      
      // Prefer district/county for city field
      const rawDistrict = data.address?.county || data.address?.state_district || data.address?.state || 'Unknown';

      // Clean the district name to show only the main district name
      const cleanDistrictName = (districtName) => {
        if (!districtName || districtName === 'Unknown') return districtName;
        
        // Remove common administrative suffixes and prefixes
        const cleanName = districtName
          .replace(/\s+(Rural|Urban)\s+Taluka$/i, '') // Remove "Rural Taluka" or "Urban Taluka"
          .replace(/\s+Taluka$/i, '') // Remove "Taluka"
          .replace(/\s+District$/i, '') // Remove "District"
          .replace(/\s+Division$/i, '') // Remove "Division"
          .replace(/\s+Block$/i, '') // Remove "Block"
          .replace(/\s+Tehsil$/i, '') // Remove "Tehsil"
          .replace(/\s+Sub-district$/i, '') // Remove "Sub-district"
          .replace(/\s+Municipality$/i, '') // Remove "Municipality"
          .replace(/\s+Corporation$/i, '') // Remove "Corporation"
          .trim();
        
        return cleanName || districtName; // Return original if cleaning results in empty string
      };

      const district = cleanDistrictName(rawDistrict);

      if (district && district !== 'Unknown') {
        setFormData(prev => ({
          ...prev,
          city: district
        }));
        setLocationError('');
        // Automatically fetch weather data for the detected district
        await getWeatherData(district);
      } else {
        setLocationError('Could not determine district from your location');
      }
    } catch (error) {
      setLocationError('Failed to get city information');
      console.error('Reverse geocoding error:', error);
    }
  };

  // Auto-detect location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nitrogen' || name === 'phosphorous' || name === 'potassium' || name === 'moisture' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  // Special handler for city input that triggers weather data fetch
  const handleCityChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      city: value
    }));
    
    // Debounce weather API calls - only fetch after user stops typing
    if (value.trim().length > 2) {
      clearTimeout(window.cityChangeTimeout);
      window.cityChangeTimeout = setTimeout(() => {
        getWeatherData(value);
      }, 1000); // Wait 1 second after user stops typing
    }
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
      setError('Please fill in all required fields (including district)');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Call the backend API instead of Gemini directly
      const response = await fetch('http://localhost:8000/predict-fertilizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data); // Debug logging
      
      if (data.success) {
        if (data.fertilizerRecommendation) {
          // Set the prediction to the fertilizerRecommendation object directly
          setPrediction(data.fertilizerRecommendation);
        } else {
          console.error('Unexpected response format:', data);
          throw new Error('Server returned success but no fertilizerRecommendation data found');
        }
      } else {
        console.error('Server returned error:', data);
        throw new Error(data.error || 'Server returned an error');
      }
      
    } catch (err) {
      console.error('Prediction error:', err);
      
      // Provide specific error messages
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 8000.');
      } else if (err.message.includes('500')) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError(`Failed to get fertilizer prediction: ${err.message}`);
      }
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
                  <label htmlFor="moisture">Moisture (%) - Auto from Weather</label>
                  <div className="weather-input-group">
                    <input
                      type="number"
                      id="moisture"
                      name="moisture"
                      value={formData.moisture}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Auto-filled from weather"
                      className={weatherLoading ? 'loading-input' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => getWeatherData(formData.city)}
                      disabled={weatherLoading || !formData.city}
                      className="weather-btn"
                      title="Refresh weather data"
                    >
                      {weatherLoading ? (
                        <span className="loading-spinner"></span>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="weather-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {weatherError && (
                    <p className="weather-error">{weatherError}</p>
                  )}
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
                <label htmlFor="city">District/City</label>
                <div className="location-input-group">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleCityChange}
                    placeholder="Enter your district or use location"
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="location-btn"
                    title="Get current location"
                  >
                    {locationLoading ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="location-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="4" />
                        <line x1="12" y1="2" x2="12" y2="6" />
                        <line x1="12" y1="18" x2="12" y2="22" />
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                        <line x1="2" y1="12" x2="6" y2="12" />
                        <line x1="18" y1="12" x2="22" y2="12" />
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                      </svg>
                    )}
                  </button>
                </div>
                {locationError && (
                  <p className="location-error">{locationError}</p>
                )}
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
              <h3>🎯 AI Fertilizer Recommendation</h3>
              <div className="prediction-result">
                <div className="result-card">
                  <h4>Expert Recommendation</h4>
                  <div className="fertilizer-recommendation">
                    {prediction && typeof prediction === 'object' && prediction.fertilizerName ? (
                      // Display structured format
                      <div className="structured-recommendation">
                        <div className="recommendation-item">
                          <h5>🌱 Recommended Fertilizer:</h5>
                          <p className="fertilizer-name">{prediction.fertilizerName}</p>
                        </div>
                        
                        <div className="recommendation-item">
                          <h5>📋 Explanation:</h5>
                          <p className="explanation">{prediction.explanation}</p>
                        </div>
                        
                        <div className="recommendation-item">
                          <h5>⚖️ Application Rate:</h5>
                          <p className="application-rate">{prediction.applicationRate}</p>
                        </div>
                      </div>
                    ) : (
                      // Display text format or debug JSON
                      <div className="text-recommendation">
                        {typeof prediction === 'string' 
                          ? prediction.split('\n').map((line, index) => (
                              line.trim() && <p key={index} className="recommendation-line">{line}</p>
                            ))
                          : prediction && typeof prediction === 'object'
                          ? <div className="json-display">
                              <p>Debug - Server response format:</p>
                              <pre>{JSON.stringify(prediction, null, 2)}</pre>
                            </div>
                          : <p>No recommendation available</p>
                        }
                      </div>
                    )}
                  </div>
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
