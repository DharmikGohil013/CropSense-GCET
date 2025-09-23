import React, { useState, useRef } from "react";
import "./DiseasePrediction.css";

const DiseasePrediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Sample disease data for mock prediction
  const diseases = [
    {
      crop: "Tomato",
      disease: "Early Blight",
      confidence: 95,
      description: "A common fungal disease causing brown spots on leaves. Can reduce yield significantly if untreated.",
      symptoms: ["Brown spots on leaves", "Yellow halos around spots", "Leaf yellowing", "Defoliation"],
      treatment: "Apply fungicide sprays (chlorothalonil or copper-based)",
      prevention: "Ensure proper crop rotation, avoid overhead watering, maintain good air circulation",
      severity: "Moderate"
    },
    {
      crop: "Corn",
      disease: "Northern Corn Leaf Blight",
      confidence: 88,
      description: "A fungal disease that causes long, elliptical lesions on corn leaves, reducing photosynthetic capacity.",
      symptoms: ["Long gray-green lesions", "Lesions turn tan with age", "Lower leaves affected first"],
      treatment: "Use resistant varieties, apply foliar fungicides if needed",
      prevention: "Crop rotation, residue management, plant resistant hybrids",
      severity: "High"
    },
    {
      crop: "Potato",
      disease: "Late Blight",
      confidence: 92,
      description: "A devastating disease that can destroy entire potato crops quickly under favorable conditions.",
      symptoms: ["Water-soaked spots on leaves", "White fuzzy growth on leaf undersides", "Brown lesions on stems"],
      treatment: "Apply protective fungicides immediately, destroy infected plants",
      prevention: "Use certified seed, avoid overhead irrigation, ensure good ventilation",
      severity: "Critical"
    }
  ];

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://127.0.0.1:7863/predict-disease', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult({
          crop: data.crop,
          disease: data.disease,
          confidence: data.confidence,
          description: data.description,
          solution: data.solution,
          severity: data.severity,
          symptoms: [], // Will be populated by real data later
          treatment: data.solution,
          prevention: "Practice good field hygiene, proper spacing, and regular monitoring."
        });
      } else {
        throw new Error(data.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Error predicting disease:', error);
      
      // Fallback to mock data if API fails
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      setResult({
        ...randomDisease,
        solution: "API connection failed. Please ensure the backend server is running on port 8001."
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return '#28a745';
      case 'moderate': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="disease-prediction-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">AI Crop Disease Predictor</h1>
          <p className="page-subtitle">
            Upload a clear image of your crop leaf to detect diseases using advanced AI technology
          </p>
        </div>

        <div className="prediction-container">
          <div className="upload-section">
            <form className="upload-form" onSubmit={handleSubmit}>
              <div 
                className={`upload-area ${isDragOver ? 'drag-over' : ''} ${preview ? 'has-image' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <div className="image-preview">
                    <img src={preview} alt="Selected crop" className="preview-image" />
                    <div className="image-overlay">
                      <div className="overlay-buttons">
                        <button 
                          type="button" 
                          className="change-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17,8 12,3 7,8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Change Image
                        </button>
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetForm();
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17,8 12,3 7,8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                      </svg>
                    </div>
                    <h3>Drop your image here</h3>
                    <p>or <span className="browse-text">browse files</span></p>
                    <div className="file-types">
                      <span>📸 PNG, JPG, JPEG up to 5MB</span>
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  hidden
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="predict-btn"
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 12l2 2 4-4" />
                        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.62 1.97" />
                      </svg>
                      Predict Disease
                    </>
                  )}
                </button>
                
                {selectedFile && (
                  <button
                    type="button"
                    className="reset-btn"
                    onClick={resetForm}
                    title="Clear image and start over"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="1,4 1,10 7,10" />
                      <path d="M3.51,15a9,9,0,0,0,2.13,3.09,9,9,0,0,0,13.4,0A9,9,0,0,0,21.49,9" />
                      <polyline points="23,20 23,14 17,14" />
                      <path d="M20.49,9A9,9,0,0,0,18.36,5.91,9,9,0,0,0,4.96,5.91,9,9,0,0,0,2.51,15" />
                    </svg>
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>

          {result && (
            <div className="results-section">
              <div className="result-card">
                <div className="result-header">
                  <h2 className="result-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 12l2 2 4-4" />
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.62 1.97" />
                    </svg>
                    Prediction Results
                  </h2>
                  <div className="confidence-badge">
                    {result.confidence}% Confidence
                  </div>
                </div>

                <div className="result-content">
                  <div className="disease-info">
                    <div className="info-row">
                      <span className="label">Crop:</span>
                      <span className="value">{result.crop}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Disease:</span>
                      <span className="value disease-name">{result.disease}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Severity:</span>
                      <span 
                        className="value severity-badge"
                        style={{ color: getSeverityColor(result.severity) }}
                      >
                        {result.severity}
                      </span>
                    </div>
                  </div>

                  <div className="disease-description">
                    <h4>Description</h4>
                    <p>{result.description}</p>
                  </div>

                  {result.symptoms && (
                    <div className="symptoms-section">
                      <h4>Common Symptoms</h4>
                      <ul className="symptoms-list">
                        {result.symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="treatment-section">
                    <h4>Recommended Treatment</h4>
                    <p className="treatment-text">{result.treatment}</p>
                  </div>

                  {result.solution && (
                    <div className="solution-section">
                      <h4>AI-Powered Solution</h4>
                      <p className="solution-text">{result.solution}</p>
                    </div>
                  )}

                  <div className="prevention-section">
                    <h4>Prevention Tips</h4>
                    <p className="prevention-text">{result.prevention}</p>
                  </div>
                </div>

                <div className="result-actions">
                  <button 
                    className="new-prediction-btn"
                    onClick={resetForm}
                  >
                    Analyze Another Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseasePrediction;
