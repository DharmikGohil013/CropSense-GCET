import React from 'react';
import './Results.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { searchResults } = location.state || {};

  if (!searchResults) {
    return (
      <div className="results-container">
        <div className="no-results">
          <h2>{t('results.noDataTitle')}</h2>
          <p>{t('results.noDataMessage')}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            {t('results.backToSearch')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← {t('results.backToSearch')}
        </button>
        <h1 className="results-title">{t('results.analysisTitle', { city: searchResults.city })}</h1>
      </div>

      <div className="results-content">
        {/* Overview Cards */}
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon climate-icon">🌡️</div>
            <div className="card-content">
              <h4>{t('results.climate')}</h4>
              <p>{searchResults.climate}</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon soil-icon">🌱</div>
            <div className="card-content">
              <h4>{t('results.soilType')}</h4>
              <p>{searchResults.soilType}</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon season-icon">🌾</div>
            <div className="card-content">
              <h4>{t('results.bestSeason')}</h4>
              <p>{searchResults.season}</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon irrigation-icon">💧</div>
            <div className="card-content">
              <h4>{t('results.irrigation')}</h4>
              <p>{searchResults.irrigation}</p>
            </div>
          </div>
        </div>

        <div className="results-grid">
          {/* Climate Details */}
          <div className="result-card">
            <h3>{t('results.climateConditions')}</h3>
            <div className="result-item">
              <span className="label">{t('results.temperature')}:</span>
              <span className="value">{searchResults.temperature}</span>
            </div>
            <div className="result-item">
              <span className="label">{t('results.humidity')}:</span>
              <span className="value">{searchResults.humidity}</span>
            </div>
            <div className="result-item">
              <span className="label">{t('results.annualRainfall')}:</span>
              <span className="value">{searchResults.rainfall}</span>
            </div>
          </div>

          {/* Crop Yield Chart */}
          <div className="result-card chart-card">
            <h3>{t('results.cropYieldPotential')}</h3>
            <div className="chart-container">
              {Object.entries(searchResults.cropYield).map(([crop, yieldValue]) => (
                <div key={crop} className="bar-chart-item">
                  <div className="bar-label">{crop.charAt(0).toUpperCase() + crop.slice(1)}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{width: `${yieldValue}%`}}
                      data-value={`${yieldValue}%`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Health Pie Chart */}
          <div className="result-card chart-card">
            <h3>{t('results.soilHealthIndicators')}</h3>
            <div className="soil-health-grid">
              {Object.entries(searchResults.soilHealth).map(([nutrient, value]) => (
                <div key={nutrient} className="soil-indicator">
                  <div className="circular-progress" style={{'--progress': value}}>
                    <span className="progress-value">{typeof value === 'number' ? `${value}%` : value}</span>
                  </div>
                  <span className="indicator-label">{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Rainfall Chart */}
          <div className="result-card chart-card full-width">
            <h3>{t('results.monthlyRainfall')}</h3>
            <div className="rainfall-chart">
              {searchResults.monthlyRainfall.map((rainfall, index) => (
                <div key={index} className="rainfall-bar">
                  <div 
                    className="rainfall-fill" 
                    style={{height: `${(rainfall / Math.max(...searchResults.monthlyRainfall)) * 100}%`}}
                    data-value={`${rainfall}mm`}
                  ></div>
                  <span className="month-label">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Crops */}
          <div className="result-card">
            <h3>{t('results.recommendedCrops')}</h3>
            <div className="crops-list">
              {searchResults.recommendedCrops.map((crop, index) => (
                <span key={index} className="crop-tag">{crop}</span>
              ))}
            </div>
          </div>

          {/* Fertilizer Recommendations */}
          <div className="result-card">
            <h3>{t('results.fertilizerRecommendations')}</h3>
            <div className="fertilizers-list">
              {searchResults.fertilizers.map((fertilizer, index) => (
                <span key={index} className="fertilizer-tag">{fertilizer}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => navigate('/', { state: { searchAgain: true } })}
          >
            {t('results.searchAnotherCity')}
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => window.print()}
          >
            {t('results.printReport')}
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => {
              const data = JSON.stringify(searchResults, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${searchResults.city}_agriculture_report.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            {t('results.downloadReport')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
