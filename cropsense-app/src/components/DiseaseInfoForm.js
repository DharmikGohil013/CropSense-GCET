import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './DiseaseInfoForm.css';

const DiseaseInfoForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cropType: '',
    symptoms: '',
    affectedParts: '',
    duration: '',
    weatherConditions: '',
    soilConditions: '',
    location: ''
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showShortAnswer, setShowShortAnswer] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.cropType || !formData.symptoms) {
      setError(t('diseaseInfoForm.fillRequired'));
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8001/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to format analysis text with proper headers
  const formatAnalysisText = (text) => {
    if (!text) return '';
    
    // Split text into lines and process
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if line contains markdown-style headers (text surrounded by **)
      if (trimmedLine.includes('**') && trimmedLine.length > 4) {
        // Extract header text between ** markers
        const headerMatch = trimmedLine.match(/\*\*(.*?)\*\*/);
        if (headerMatch) {
          const headerText = headerMatch[1];
          const remainingText = trimmedLine.replace(/\*\*(.*?)\*\*/, '').trim();
          
          return (
            <div key={index} className="analysis-section">
              <h3 className="analysis-header">{headerText}</h3>
              {remainingText && <p>{remainingText}</p>}
            </div>
          );
        }
      }
      
      // Handle regular bullet points
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        return (
          <li key={index} className="analysis-bullet">
            {trimmedLine.substring(2)}
          </li>
        );
      }
      
      // Handle sub-points with indentation
      if (trimmedLine.startsWith('    * ') || trimmedLine.startsWith('    - ')) {
        return (
          <li key={index} className="analysis-sub-bullet">
            {trimmedLine.substring(6)}
          </li>
        );
      }
      
      // Regular paragraph
      if (trimmedLine.length > 0) {
        return <p key={index} className="analysis-paragraph">{trimmedLine}</p>;
      }
      
      return null;
    }).filter(Boolean);
    
    return <div className="formatted-analysis">{formattedLines}</div>;
  };

  // Function to generate short summary
  const generateShortSummary = (results) => {
    if (!results || !results.possible_diseases) return '';
    
    const topDiseases = results.possible_diseases.slice(0, 2);
    const urgentRecommendations = results.recommendations 
      ? results.recommendations.filter(r => r.category === 'Immediate Action').slice(0, 2)
      : [];
    
    return {
      diseases: topDiseases,
      actions: urgentRecommendations,
      cropType: results.crop_type || formData.cropType
    };
  };

  const handleReset = () => {
    setFormData({
      cropType: '',
      symptoms: '',
      affectedParts: '',
      duration: '',
      weatherConditions: '',
      soilConditions: '',
      location: ''
    });
    setResults(null);
    setError('');
  };

  if (results) {
    return (
      <div className="disease-info-container">
        <div className="page-header">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            {t('common.back')}
          </button>
          <h1 className="page-title">Disease Analysis Results</h1>
        </div>

        <div className="results-section">
          <div className="results-header">
            <h2>Analysis Results</h2>
            <div className="results-controls">
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${!showShortAnswer ? 'active' : ''}`}
                  onClick={() => setShowShortAnswer(false)}
                >
                  Detailed Analysis
                </button>
                <button 
                  className={`toggle-btn ${showShortAnswer ? 'active' : ''}`}
                  onClick={() => setShowShortAnswer(true)}
                >
                  Short Summary
                </button>
              </div>
              <button className="new-analysis-btn" onClick={handleReset}>
                New Analysis
              </button>
            </div>
          </div>

          <div className="analysis-summary">
            <h3>Crop Information</h3>
            <p><strong>Crop Type:</strong> {formData.cropType}</p>
            <p><strong>Symptoms:</strong> {formData.symptoms}</p>
            {formData.affectedParts && <p><strong>Affected Parts:</strong> {formData.affectedParts}</p>}
          </div>

          {showShortAnswer ? (
            // Short Summary View
            <div className="short-summary">
              <div className="summary-card">
                <h3>🔍 Quick Diagnosis</h3>
                {(() => {
                  const summary = generateShortSummary(results);
                  return (
                    <div className="quick-diagnosis">
                      <div className="top-diseases">
                        <h4>Most Likely Diseases:</h4>
                        {summary.diseases.map((disease, index) => (
                          <div key={index} className="disease-quick">
                            <span className="disease-name">{disease.name}</span>
                            <span className={`probability ${disease.probability.toLowerCase()}`}>
                              {disease.probability} Probability
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="urgent-actions">
                        <h4>Immediate Actions:</h4>
                        {summary.actions.map((action, index) => (
                          <div key={index} className="action-quick">
                            • {action.advice}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            // Detailed Analysis View
            <div className="detailed-analysis">
              <div className="ai-analysis-card">
                <h3>🤖 AI Disease Analysis</h3>
                <div className="analysis-content">
                  {formatAnalysisText(results.analysis)}
                </div>
              </div>

              {results.possible_diseases && results.possible_diseases.length > 0 && (
                <div className="diseases-card">
                  <h3>🦠 Possible Diseases</h3>
                  <div className="diseases-list">
                    {results.possible_diseases.map((disease, index) => (
                      <div key={index} className="disease-item">
                        <div className="disease-header">
                          <h4>{disease.name}</h4>
                          <span className={`probability ${disease.probability.toLowerCase()}`}>
                            {disease.probability} Probability
                          </span>
                        </div>
                        <p className="disease-description">{disease.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.recommendations && results.recommendations.length > 0 && (
                <div className="recommendations-card">
                  <h3>💡 Recommendations</h3>
                  <div className="recommendations-list">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="recommendation-item">
                        <div className="recommendation-category">{rec.category}</div>
                        <p className="recommendation-advice">{rec.advice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="analysis-footer">
            <p className="analysis-time">
              Analysis completed in {results.processing_time?.toFixed(2)} seconds at {results.analysis_timestamp}
            </p>
            <p className="disclaimer">
              ⚠️ This analysis is for reference only. Please consult with local agricultural experts for accurate diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="disease-info-container">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          {t('common.back')}
        </button>
        <h1 className="page-title">Disease Information Form</h1>
        <p className="page-subtitle">Describe your crop symptoms for AI-powered disease analysis</p>
      </div>

      <div className="form-section">
        <form onSubmit={handleSubmit} className="disease-form">
          <div className="form-group">
            <label htmlFor="cropType">Crop Type *</label>
            <select
              id="cropType"
              name="cropType"
              value={formData.cropType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select crop type</option>
              <option value="Cassava">Cassava</option>
              <option value="Maize">Maize</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Bean">Bean</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="symptoms">Symptoms Description *</label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              placeholder="Describe the symptoms you've observed (e.g., yellow leaves, brown spots, wilting, etc.)"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="affectedParts">Affected Plant Parts</label>
            <select
              id="affectedParts"
              name="affectedParts"
              value={formData.affectedParts}
              onChange={handleInputChange}
            >
              <option value="">Select affected parts</option>
              <option value="Leaves">Leaves</option>
              <option value="Stems">Stems</option>
              <option value="Roots">Roots</option>
              <option value="Fruits">Fruits</option>
              <option value="Flowers">Flowers</option>
              <option value="Whole Plant">Whole Plant</option>
              <option value="Multiple Parts">Multiple Parts</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration of Symptoms</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
            >
              <option value="">Select duration</option>
              <option value="1-3 days">1-3 days</option>
              <option value="1 week">1 week</option>
              <option value="2-3 weeks">2-3 weeks</option>
              <option value="1 month">1 month</option>
              <option value="More than 1 month">More than 1 month</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="weatherConditions">Recent Weather Conditions</label>
            <select
              id="weatherConditions"
              name="weatherConditions"
              value={formData.weatherConditions}
              onChange={handleInputChange}
            >
              <option value="">Select weather conditions</option>
              <option value="Very wet/rainy">Very wet/rainy</option>
              <option value="Normal rainfall">Normal rainfall</option>
              <option value="Dry conditions">Dry conditions</option>
              <option value="High humidity">High humidity</option>
              <option value="Temperature extremes">Temperature extremes</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="soilConditions">Soil Conditions</label>
            <select
              id="soilConditions"
              name="soilConditions"
              value={formData.soilConditions}
              onChange={handleInputChange}
            >
              <option value="">Select soil conditions</option>
              <option value="Well-drained">Well-drained</option>
              <option value="Waterlogged">Waterlogged</option>
              <option value="Dry/sandy">Dry/sandy</option>
              <option value="Clay/heavy">Clay/heavy</option>
              <option value="Recently fertilized">Recently fertilized</option>
              <option value="Poor/depleted">Poor/depleted</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location/Region</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter your location or region"
            />
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="analyze-btn"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="loading-spinner"></div>
                  Analyzing...
                </>
              ) : (
                'Analyze Symptoms'
              )}
            </button>
            
            <button 
              type="button" 
              className="reset-btn"
              onClick={handleReset}
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiseaseInfoForm;
