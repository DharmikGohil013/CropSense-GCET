import React, { useState } from "react"; 
import "./DiseasePrediction.css";
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { getTranslatedDiseaseName, getTranslatedSeverity } from '../utils/translation';

const DiseasePrediction = () => {
  const { t, i18n } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setShowCamera(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setShowCamera(true);
      
      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Wait for video to load
      video.onloadedmetadata = () => {
        // Create canvas for capture
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Show camera interface
        const cameraContainer = document.getElementById('camera-container');
        if (cameraContainer) {
          cameraContainer.appendChild(video);
          
          // Add capture button
          const captureBtn = document.createElement('button');
          captureBtn.textContent = t('diseasePrediction.capturePhoto');
          captureBtn.className = 'capture-btn';
          captureBtn.onclick = () => {
            // Draw video frame to canvas
            context.drawImage(video, 0, 0);
            
            // Convert to blob
            canvas.toBlob((blob) => {
              const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
              setSelectedFile(file);
              setPreview(URL.createObjectURL(file));
              
              // Stop camera and cleanup
              stream.getTracks().forEach(track => track.stop());
              setShowCamera(false);
              cameraContainer.innerHTML = '';
            }, 'image/jpeg', 0.8);
          };
          
          cameraContainer.appendChild(captureBtn);
          
          // Add cancel button
          const cancelBtn = document.createElement('button');
          cancelBtn.textContent = t('diseasePrediction.cancel');
          cancelBtn.className = 'cancel-btn';
          cancelBtn.onclick = () => {
            stream.getTracks().forEach(track => track.stop());
            setShowCamera(false);
            cameraContainer.innerHTML = '';
          };
          
          cameraContainer.appendChild(cancelBtn);
        }
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions or use file upload instead.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8001/predict-disease', {
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
          recommendation: data.solution // Use solution as recommendation for compatibility
        });
      } else {
        throw new Error(data.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Error predicting disease:', error);
      
      // Show error message to user
      setResult({
        crop: t('diseasePrediction.errorConnection'),
        disease: t('diseasePrediction.errorApi'),
        description: `${t('diseasePrediction.errorMessage')}: ${error.message}`,
        recommendation: t('diseasePrediction.errorRecommendation'),
        solution: t('diseasePrediction.errorSolution'),
        confidence: 0,
        severity: "Unknown"
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
    setShowCamera(false);
    
    // Clear camera container if it exists
    const cameraContainer = document.getElementById('camera-container');
    if (cameraContainer) {
      cameraContainer.innerHTML = '';
    }
  };

  // Function to parse and format the AI solution
  const formatSolution = (solutionText) => {
    try {
      // Try to parse as JSON first
      const solutionObj = JSON.parse(solutionText);
      return (
        <div className="formatted-solution">
          {Object.entries(solutionObj).map(([key, value], index) => (
            <div key={index} className="solution-category">
              <h5 className="category-title">{key.charAt(0).toUpperCase() + key.slice(1)}</h5>
              <div className="category-content">
                {Array.isArray(value) ? (
                  <ul className="solution-list">
                    {value.map((item, idx) => (
                      <li key={idx} className="solution-item">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="solution-text-item">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      // If it's not JSON, return as regular text
      return <p className="solution-text">{solutionText}</p>;
    }
  };

  return (
    <div className="predict-page">
      <div className="container">
        <div className="header-with-language">
          <h1 className="page-title">{t('diseasePrediction.title')}</h1>
          <LanguageSelector />
        </div>

        {/* Subtitle text and upload box side by side */}
        <div className="subtitle-upload">
          <p className="page-subtitle">
            {t('diseasePrediction.subtitle')}
          </p>

          <form className="upload-box" onSubmit={handleSubmit}>
            {!showCamera && (
              <>
                <label htmlFor="file-upload" className="upload-label">
                  {preview ? (
                    <img src={preview} alt="preview" className="preview-img" />
                  ) : (
                    <div className="placeholder">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="upload-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                        <rect x="3" y="16" width="18" height="4" rx="2" ry="2" />
                      </svg>
                      <p>{t('diseasePrediction.uploadPlaceholder')}</p>
                      <span className="hint">{t('diseasePrediction.uploadHint')}</span>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
                
                <div className="upload-options">
                  <div className="option-divider">
                    <span>{t('diseasePrediction.or')}</span>
                  </div>
                  <button
                    type="button"
                    className="camera-btn"
                    onClick={handleCameraCapture}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="camera-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    {t('diseasePrediction.useCamera')}
                  </button>
                </div>
              </>
            )}
            
            {showCamera && (
              <div className="camera-section">
                <h4>{t('diseasePrediction.cameraCapture')}</h4>
                <div id="camera-container" className="camera-container"></div>
              </div>
            )}
            <button
              type="submit"
              className="predict-button"
              disabled={!selectedFile || loading}
            >
              {loading ? (
                <span className="button-loading">
                  <span className="button-spinner"></span>
                  {t('diseasePrediction.analyzingImage')}
                </span>
              ) : (
                t('diseasePrediction.predictDisease')
              )}
            </button>
            
            {selectedFile && (
              <button
                type="button"
                className="reset-button"
                onClick={resetForm}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="reset-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="1,4 1,10 7,10" />
                  <path d="M3.51,15a9,9,0,0,0,2.13,3.09,9,9,0,0,0,13.4,0A9,9,0,0,0,21.49,9" />
                  <polyline points="23,20 23,14 17,14" />
                  <path d="M20.49,9A9,9,0,0,0,18.36,5.91,9,9,0,0,0,4.96,5.91,9,9,0,0,0,2.51,15" />
                </svg>
                {t('diseasePrediction.reset')}
              </button>
            )}
          </form>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h3 className="loading-title">{t('diseasePrediction.analyzing')}</h3>
              <p className="loading-text">
                {t('diseasePrediction.analyzingDesc')}
              </p>
              <div className="loading-progress">
                <div className="progress-bar"></div>
              </div>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="result-card">
            {result.crop.toLowerCase() === 'invalid' || result.crop.toLowerCase().includes('invalid') ? (
              // Invalid image result
              <div className="invalid-result">
                <div className="invalid-header">
                  <h2 className="invalid-title">
                    {t('diseasePrediction.invalidImage')}
                  </h2>
                </div>
                
                <div className="invalid-content">
                  <div className="invalid-icon">
                    !
                  </div>
                  <h3 className="invalid-message">{t('diseasePrediction.invalidMessage')}</h3>
                  <p className="invalid-description">
                    {t('diseasePrediction.invalidDescription')}
                  </p>
                  
                  <div className="image-requirements">
                    <div className="requirement-item">
                      <span className="req-icon">•</span>
                      <span>{t('diseasePrediction.requirements.clearView')}</span>
                    </div>
                    <div className="requirement-item">
                      <span className="req-icon">•</span>
                      <span>{t('diseasePrediction.requirements.goodLighting')}</span>
                    </div>
                    <div className="requirement-item">
                      <span className="req-icon">•</span>
                      <span>{t('diseasePrediction.requirements.sharpImage')}</span>
                    </div>
                    <div className="requirement-item">
                      <span className="req-icon">•</span>
                      <span>{t('diseasePrediction.requirements.focusPlant')}</span>
                    </div>
                  </div>
                  
                  <div className="invalid-actions">
                    <button 
                      className="retry-btn"
                      onClick={resetForm}
                    >
                      {t('diseasePrediction.tryAnother')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Valid result
              <>
                <h2 className="result-title">
                  {t('diseasePrediction.predictionResult')}
                  {result.confidence && (
                    <span className="confidence-badge">{result.confidence}% {t('diseasePrediction.confidence')}</span>
                  )}
                </h2>
                
                <div className="result-info">
                  <div className="info-row">
                    <strong>{t('diseasePrediction.crop')}:</strong> <span className="crop-name">{result.crop}</span>
                  </div>
                  <div className="info-row">
                    <strong>{t('diseasePrediction.disease')}:</strong> 
                    <span className="disease-name">{getTranslatedDiseaseName(result.disease, i18n.language)}</span>
                  </div>
                  {result.severity && (
                    <div className="info-row">
                      <strong>{t('diseasePrediction.severity')}:</strong> 
                      <span className={`severity-badge severity-${result.severity.toLowerCase()}`}>
                        {getTranslatedSeverity(result.severity, i18n.language)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="result-description">
                  <h4>{t('diseasePrediction.description')}</h4>
                  <p className="result-desc">{result.description}</p>
                </div>

                {result.solution && (
                  <div className="solution-section">
                    <h4>{t('diseasePrediction.aiSolution')}</h4>
                    <div className="solution-content">
                      {formatSolution(result.solution)}
                    </div>
                  </div>
                )}

                <div className="recommendation-section">
                  <h4>{t('diseasePrediction.recommendations')}</h4>
                  <div className="recommendation-content">
                    {formatSolution(result.recommendation)}
                  </div>
                </div>

                <div className="result-actions">
                  <button 
                    className="new-prediction-btn"
                    onClick={resetForm}
                  >
                    {t('diseasePrediction.analyzeAnother')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseasePrediction;
