import React, { useState } from 'react';
import './ImageToDisease.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ImageToDisease = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [diseaseResults, setDiseaseResults] = useState(null);

  // Static disease data for demonstration
  const staticDiseaseData = {
    diseaseName: "Late Blight",
    scientificName: "Phytophthora infestans",
    severity: "High",
    confidence: "92%",
    affectedCrop: "Tomato",
    symptoms: [
      "Dark brown to black lesions on leaves",
      "White fungal growth on leaf undersides",
      "Rapid spreading during humid conditions",
      "Fruit rot with dark patches"
    ],
    causes: [
      "High humidity (>80%)",
      "Cool temperatures (15-20°C)",
      "Poor air circulation",
      "Overhead watering"
    ],
    treatment: [
      "Apply copper-based fungicides",
      "Remove affected plant parts immediately",
      "Improve air circulation",
      "Avoid overhead watering",
      "Use resistant varieties"
    ],
    prevention: [
      "Ensure proper plant spacing",
      "Water at soil level",
      "Regular monitoring",
      "Crop rotation",
      "Remove plant debris"
    ],
    economicImpact: "Can cause 50-100% crop loss if untreated"
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert(t('imageToDisease.noImageSelected'));
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call with static data
    setTimeout(() => {
      setDiseaseResults(staticDiseaseData);
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setShowResults(false);
    setDiseaseResults(null);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF8800';
      case 'low': return '#44AA44';
      default: return '#666666';
    }
  };

  return (
    <div className="image-to-disease-container">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          {t('common.back')}
        </button>
        <h1 className="page-title">{t('imageToDisease.title')}</h1>
        <p className="page-subtitle">{t('imageToDisease.subtitle')}</p>
      </div>

      {!showResults ? (
        <div className="upload-section">
          <div className="upload-card">
            <div className="upload-area">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" className="preview-image" />
                  <button 
                    className="remove-image-btn"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.2639 15.9375L12.5958 14.2834C12.2668 13.9583 11.7332 13.9583 11.4042 14.2834L9.73611 15.9375M12 12.5V19.25M20.25 12C20.25 16.5563 16.5563 20.25 12 20.25C7.44365 20.25 3.75 16.5563 3.75 12C3.75 7.44365 7.44365 3.75 12 3.75C16.5563 3.75 20.25 7.44365 20.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>{t('imageToDisease.uploadTitle')}</h3>
                  <p>{t('imageToDisease.uploadDescription')}</p>
                  <p className="file-types">{t('imageToDisease.supportedFormats')}</p>
                </div>
              )}
            </div>

            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
            
            <div className="upload-actions">
              <label htmlFor="image-upload" className="upload-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16V4M12 4L8 8M12 4L16 8M4 17V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('imageToDisease.chooseImage')}
              </label>
              
              {selectedImage && (
                <button 
                  className="analyze-btn"
                  onClick={handleSubmit}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="loading-spinner"></div>
                      {t('imageToDisease.analyzing')}
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 14H20L22 16L20 18H15.5C15.0858 18 14.6667 17.8334 14.3333 17.5L11 14.5C10.3333 14 9.66667 14 9 14.5L6.66667 16.5C6.33333 16.8334 5.91421 17 5.5 17H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="3" cy="3" r="1" fill="currentColor"/>
                        <circle cx="6" cy="6" r="1" fill="currentColor"/>
                        <circle cx="12" cy="4" r="1" fill="currentColor"/>
                      </svg>
                      {t('imageToDisease.analyzeImage')}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🔍</div>
              <h3>{t('imageToDisease.howItWorks')}</h3>
              <p>{t('imageToDisease.howItWorksDesc')}</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <h3>{t('imageToDisease.accuracy')}</h3>
              <p>{t('imageToDisease.accuracyDesc')}</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <h3>{t('imageToDisease.fastResults')}</h3>
              <p>{t('imageToDisease.fastResultsDesc')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="results-section">
          <div className="results-header">
            <h2>{t('imageToDisease.analysisResults')}</h2>
            <button className="new-analysis-btn" onClick={handleReset}>
              {t('imageToDisease.analyzeNew')}
            </button>
          </div>

          <div className="results-content">
            <div className="image-result-card">
              <h3>{t('imageToDisease.uploadedImage')}</h3>
              <img src={imagePreview} alt="Analyzed" className="analyzed-image" />
            </div>

            <div className="disease-info-card">
              <div className="disease-header">
                <h3>{diseaseResults.diseaseName}</h3>
                <div className="disease-meta">
                  <span className="scientific-name">{diseaseResults.scientificName}</span>
                  <div className="severity-badge" style={{backgroundColor: getSeverityColor(diseaseResults.severity)}}>
                    {diseaseResults.severity} {t('imageToDisease.severity')}
                  </div>
                  <div className="confidence-badge">
                    {diseaseResults.confidence} {t('imageToDisease.confidence')}
                  </div>
                </div>
              </div>

              <div className="affected-crop">
                <strong>{t('imageToDisease.affectedCrop')}:</strong> {diseaseResults.affectedCrop}
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-card symptoms">
                <h4>🔴 {t('imageToDisease.symptoms')}</h4>
                <ul>
                  {diseaseResults.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-card causes">
                <h4>⚠️ {t('imageToDisease.causes')}</h4>
                <ul>
                  {diseaseResults.causes.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-card treatment">
                <h4>💊 {t('imageToDisease.treatment')}</h4>
                <ul>
                  {diseaseResults.treatment.map((treatment, index) => (
                    <li key={index}>{treatment}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-card prevention">
                <h4>🛡️ {t('imageToDisease.prevention')}</h4>
                <ul>
                  {diseaseResults.prevention.map((prevention, index) => (
                    <li key={index}>{prevention}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="economic-impact-card">
              <h4>💰 {t('imageToDisease.economicImpact')}</h4>
              <p>{diseaseResults.economicImpact}</p>
            </div>

            <div className="action-buttons">
              <button className="action-btn primary" onClick={handleReset}>
                {t('imageToDisease.analyzeAnother')}
              </button>
              <button className="action-btn secondary" onClick={() => window.print()}>
                {t('common.print')}
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => {
                  const data = JSON.stringify(diseaseResults, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `disease_analysis_${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                {t('common.download')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageToDisease;
