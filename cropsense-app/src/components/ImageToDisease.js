import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ImageToDisease.css';

const ImageToDisease = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [diseaseResults, setDiseaseResults] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(t('imageToDisease.invalidFileType'));
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(t('imageToDisease.fileTooLarge'));
        return;
      }

      setError('');
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError(t('imageToDisease.pleaseSelectImage'));
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch('http://localhost:8001/analyze-disease', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      // Dynamic transformation showing API data with timestamps
      const analysisTime = new Date().toLocaleString();
      const transformedResults = {
        diseaseName: data.top_prediction.label,
        scientificName: `${data.top_prediction.label} (API Result)`,
        confidence: Math.round(data.top_prediction.confidence * 100),
        affectedCrop: 'Cassava',
        severity: data.top_prediction.confidence > 0.8 ? 'High' : 
                 data.top_prediction.confidence > 0.5 ? 'Medium' : 'Low',
        processingTime: `${(data.processing_time * 1000).toFixed(0)}ms`,
        predictions: data.all_predictions.map(pred => ({
          label: pred.label,
          confidence: Math.round(pred.confidence * 100)
        })),
        aiDescription: data.gemini_description || 'AI analysis not available',
        symptoms: [
          `🔍 LIVE API RESULT: ${data.top_prediction.label}`,
          `📊 Confidence: ${Math.round(data.top_prediction.confidence * 100)}%`,
          `⏰ Analyzed at: ${analysisTime}`
        ],
        treatment: [
          `💊 Treatment for: ${data.top_prediction.label}`,
          `🎯 Primary recommendation based on ${Math.round(data.top_prediction.confidence * 100)}% confidence`,
          `🔄 Real-time API response received`
        ],
        prevention: [
          `🛡️ Prevention for: ${data.top_prediction.label}`,
          `📈 Based on current analysis results`,
          `🌱 Updated analysis from backend API`
        ],
        recommendations: [
          `⭐ Recommendations for: ${data.top_prediction.label}`,
          `📱 Generated from live API call`,
          `🔬 Processing time: ${(data.processing_time * 1000).toFixed(0)}ms`
        ],
        additionalInfo: [
          `📊 DYNAMIC RESULT - Confidence: ${Math.round(data.top_prediction.confidence * 100)}%`,
          `🕒 Generated: ${analysisTime}`,
          `🔗 Source: Backend API (Port 8001)`,
          `📈 Top ${data.all_predictions.length} predictions received`
        ],
        economicImpact: `💰 Economic impact analysis for ${data.top_prediction.label} - Updated from live API response`
      };

      console.log('Transformed Results:', transformedResults); // Debug log

      setDiseaseResults(transformedResults);
      setShowResults(true);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(t('imageToDisease.analysisError') + ': ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to extract sections from Gemini description
  const extractSectionFromDescription = (description, section) => {
    const lines = description.split('\n').filter(line => line.trim());
    const sectionKeywords = {
      symptoms: ['symptom', 'sign', 'appear', 'visible'],
      treatment: ['treatment', 'control', 'manage', 'spray', 'apply'],
      prevention: ['prevent', 'avoid', 'practice', 'hygiene', 'sanitation'],
      recommendations: ['recommend', 'suggest', 'should', 'advice'],
      additional: ['note', 'important', 'consider', 'remember'],
      economic: ['economic', 'loss', 'yield', 'impact', 'cost']
    };

    const keywords = sectionKeywords[section] || [];
    const relevantLines = lines.filter(line => 
      keywords.some(keyword => 
        line.toLowerCase().includes(keyword)
      )
    );

    return relevantLines.length > 0 ? relevantLines : [description.substring(0, 100) + '...'];
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setShowResults(false);
    setDiseaseResults(null);
    setError('');
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF8800';
      case 'low': return '#44AA44';
      default: return '#888888';
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
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <div className="upload-actions">
              <button 
                className="upload-btn" 
                onClick={() => fileInputRef.current?.click()}
              >
                {t('imageToDisease.chooseFile')}
              </button>
              
              {selectedImage && (
                <button 
                  className="analyze-btn" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="loading-spinner"></div>
                      {t('imageToDisease.analyzing')}
                    </>
                  ) : (
                    t('imageToDisease.analyze')
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="results-section">
          <div className="results-header">
            <h2>{t('imageToDisease.analysisResults')}</h2>
            <button className="new-analysis-btn" onClick={handleReset}>
              {t('imageToDisease.newAnalysis')}
            </button>
          </div>

          <div className="results-content">
            <div className="image-result-card">
              <h3>{t('imageToDisease.analyzedImage')}</h3>
              <img 
                src={imagePreview} 
                alt="Analyzed crop" 
                className="analyzed-image"
              />
            </div>

            <div className="disease-info-card">
              <div className="disease-header">
                <h3>{diseaseResults.diseaseName}</h3>
                <div className="disease-meta">
                  <span className="scientific-name">{diseaseResults.scientificName}</span>
                  <span className="confidence-badge">
                    {t('imageToDisease.confidence')}: {diseaseResults.confidence}%
                  </span>
                </div>
                <p className="affected-crop">
                  {t('imageToDisease.affectedCrop')}: {diseaseResults.affectedCrop}
                </p>
              </div>

              <div className="analysis-meta">
                <p>{t('imageToDisease.analysisDate')}: {new Date().toLocaleDateString()}</p>
                <p>{t('imageToDisease.processingTime')}: {diseaseResults.processingTime}</p>
              </div>
            </div>
          </div>

          {diseaseResults.predictions && (
            <div className="predictions-card">
              <h4>🎯 {t('imageToDisease.topPredictions')}</h4>
              <div className="predictions-list">
                {diseaseResults.predictions.map((prediction, index) => (
                  <div key={index} className="prediction-item">
                    <span className="prediction-rank">#{index + 1}</span>
                    <span className="prediction-label">{prediction.label}</span>
                    <span className="prediction-confidence">{prediction.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {diseaseResults.aiDescription && (
            <div className="ai-description-card">
              <h4>🤖 {t('imageToDisease.aiAnalysis')}</h4>
              <div className="description-content">
                <p className="description-text">{diseaseResults.aiDescription}</p>
              </div>
            </div>
          )}

          <div className="details-grid">
            <div className="detail-card">
              <h4>🔍 {t('imageToDisease.symptoms')}</h4>
              <ul>
                {diseaseResults.symptoms?.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>

            <div className="detail-card">
              <h4>🛡️ {t('imageToDisease.treatment')}</h4>
              <ul>
                {diseaseResults.treatment?.map((treatment, index) => (
                  <li key={index}>{treatment}</li>
                ))}
              </ul>
            </div>

            <div className="detail-card">
              <h4>🚫 {t('imageToDisease.prevention')}</h4>
              <ul>
                {diseaseResults.prevention?.map((prevention, index) => (
                  <li key={index}>{prevention}</li>
                ))}
              </ul>
            </div>

            <div className="detail-card">
              <h4>🌿 {t('imageToDisease.recommendations')}</h4>
              <ul>
                {diseaseResults.recommendations?.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="detail-card">
            <h4>📚 {t('imageToDisease.additionalInfo')}</h4>
            <ul>
              {diseaseResults.additionalInfo?.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
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
      )}
    </div>
  );
};

export default ImageToDisease;
