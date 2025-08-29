import React from 'react';
import './Home.css';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleExploreFeatures = () => {
    navigate('/image-to-disease');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Left Side - SVG Illustration */}
        <div className="home-visual">
          <div className="crop-illustration">
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="crop-svg"
            >
              {/* Farm Background */}
              <rect width="400" height="400" fill="url(#farmGradient)" />
              
              {/* Sun */}
              <circle cx="320" cy="80" r="30" fill="#FFD700" opacity="0.8" />
              <g stroke="#FFD700" strokeWidth="2" opacity="0.6">
                <line x1="290" y1="50" x2="280" y2="40" />
                <line x1="310" y1="40" x2="320" y2="30" />
                <line x1="330" y1="40" x2="340" y2="30" />
                <line x1="350" y1="50" x2="360" y2="40" />
                <line x1="360" y1="70" x2="370" y2="80" />
                <line x1="360" y1="90" x2="370" y2="100" />
                <line x1="350" y1="110" x2="360" y2="120" />
                <line x1="330" y1="120" x2="340" y2="130" />
              </g>
              
              {/* Mountains/Hills */}
              <path d="M0 120 Q100 80 200 120 Q300 160 400 120 V400 H0 Z" fill="url(#hillGradient)" opacity="0.3" />
              
              {/* Crops/Plants */}
              <g className="crop-plants">
                {/* Wheat stalks */}
                <g transform="translate(80, 200)">
                  <path d="M0 120 Q-5 100 0 80 Q5 60 0 40 Q-3 20 0 0" stroke="#D4AF37" strokeWidth="3" fill="none" />
                  <circle cx="0" cy="10" r="2" fill="#DAA520" />
                  <circle cx="-3" cy="20" r="2" fill="#DAA520" />
                  <circle cx="3" cy="30" r="2" fill="#DAA520" />
                  <circle cx="-2" cy="40" r="2" fill="#DAA520" />
                </g>
                
                <g transform="translate(120, 210)">
                  <path d="M0 110 Q-4 90 0 70 Q4 50 0 30 Q-2 10 0 0" stroke="#D4AF37" strokeWidth="3" fill="none" />
                  <circle cx="0" cy="8" r="2" fill="#DAA520" />
                  <circle cx="-2" cy="18" r="2" fill="#DAA520" />
                  <circle cx="2" cy="28" r="2" fill="#DAA520" />
                </g>
                
                {/* Rice plants */}
                <g transform="translate(160, 220)">
                  <path d="M0 100 Q-6 80 0 60 Q6 40 0 20 Q-4 10 0 0" stroke="#228B22" strokeWidth="4" fill="none" />
                  <path d="M-10 20 Q-5 15 0 20 Q5 15 10 20" stroke="#32CD32" strokeWidth="2" fill="none" />
                  <path d="M-8 40 Q-3 35 0 40 Q3 35 8 40" stroke="#32CD32" strokeWidth="2" fill="none" />
                </g>
                
                <g transform="translate(200, 215)">
                  <path d="M0 105 Q-5 85 0 65 Q5 45 0 25 Q-3 15 0 0" stroke="#228B22" strokeWidth="4" fill="none" />
                  <path d="M-8 25 Q-3 20 0 25 Q3 20 8 25" stroke="#32CD32" strokeWidth="2" fill="none" />
                </g>
                
                {/* Cotton plants */}
                <g transform="translate(240, 200)">
                  <path d="M0 120 L0 0" stroke="#2E8B57" strokeWidth="4" />
                  <circle cx="0" cy="30" r="8" fill="#F5F5DC" opacity="0.9" />
                  <circle cx="-8" cy="50" r="6" fill="#F5F5DC" opacity="0.8" />
                  <circle cx="8" cy="70" r="7" fill="#F5F5DC" opacity="0.9" />
                  <path d="M-15 40 Q0 30 15 40" stroke="#228B22" strokeWidth="2" fill="none" />
                  <path d="M-12 60 Q0 50 12 60" stroke="#228B22" strokeWidth="2" fill="none" />
                </g>
                
                {/* Corn stalks */}
                <g transform="translate(280, 190)">
                  <path d="M0 130 L0 0" stroke="#3CB371" strokeWidth="5" />
                  <ellipse cx="0" cy="40" rx="4" ry="15" fill="#FFD700" />
                  <path d="M-20 60 Q0 50 20 60" stroke="#228B22" strokeWidth="3" fill="none" />
                  <path d="M-18 80 Q0 70 18 80" stroke="#228B22" strokeWidth="3" fill="none" />
                  <path d="M-15 100 Q0 90 15 100" stroke="#228B22" strokeWidth="3" fill="none" />
                </g>
              </g>
              
              {/* Ground/Soil */}
              <rect x="0" y="320" width="400" height="80" fill="url(#soilGradient)" />
              
              {/* Animated elements */}
              <g className="floating-particles">
                <circle cx="50" cy="150" r="2" fill="#00FF7F" opacity="0.6">
                  <animate attributeName="cy" values="150;140;150" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="350" cy="180" r="1.5" fill="#64FFDA" opacity="0.5">
                  <animate attributeName="cy" values="180;170;180" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="100" r="1" fill="#00FF7F" opacity="0.7">
                  <animate attributeName="cy" values="100;90;100" dur="5s" repeatCount="indefinite" />
                </circle>
              </g>
              
              {/* Gradients */}
              <defs>
                <linearGradient id="farmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0a0a0a" />
                  <stop offset="50%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <linearGradient id="hillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#064E3B" />
                  <stop offset="100%" stopColor="#00FF7F" />
                </linearGradient>
                <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="100%" stopColor="#654321" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right Side - Content Section */}
        <div className="home-content-section">
          <div className="content-section">
            <h1 className="home-title">{t('home.title')}</h1>
            <p className="home-subtitle">{t('home.subtitle')}</p>
            
            <div className="cta-section">
              <p className="cta-text">Upload crop images and get instant AI-powered disease detection with treatment recommendations</p>
              <div className="cta-buttons">
                <button className="cta-button" onClick={handleExploreFeatures}>Start Disease Detection</button>
                <Link to="/rice-analysis" className="cta-button secondary">🌾 Rice Analysis</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Content Section */}
      <div className="extended-content">
        {/* Features Section */}
        <div className="features-section">
          <div className="container">
            <h2 className="section-title handwriting-font">AI-Powered Disease Detection</h2>
            <p className="section-subtitle">Advanced artificial intelligence to identify crop diseases from images and provide treatment recommendations</p>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#00FF7F"/>
                    <path d="M19 11L19.75 13.5L22 14L19.75 14.5L19 17L18.25 14.5L16 14L18.25 13.5L19 11Z" fill="#064E3B"/>
                    <circle cx="12" cy="12" r="8" stroke="#00FF7F" strokeWidth="2" fill="none"/>
                    <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Image-Based Disease Detection</h3>
                <p>Upload crop images and get instant AI-powered disease identification with treatment recommendations. Our advanced computer vision technology can detect diseases early and suggest appropriate remedies.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="12" rx="2" stroke="#00FF7F" strokeWidth="2" fill="none"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#00FF7F"/>
                    <path d="M12 11L15 8L21 14" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 14L6 11L10 15" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>High Accuracy Analysis</h3>
                <p>Our AI model is trained on thousands of crop disease images with over 95% accuracy. Get reliable disease identification and confidence scores for better decision making.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="#00FF7F"/>
                    <path d="M12 7C10.9 7 10 7.9 10 9V15C10 16.1 10.9 17 12 17C13.1 17 14 16.1 14 15V9C14 7.9 13.1 7 12 7Z" fill="#064E3B"/>
                    <circle cx="12" cy="20" r="2" fill="#00FF7F"/>
                    <path d="M8 12H16" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Treatment Recommendations</h3>
                <p>Get detailed treatment plans including organic and chemical solutions, prevention methods, and economic impact analysis to help you make informed decisions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="technology-section">
          <div className="container">
            <h2 className="section-title handwriting-font">Disease Detection Technology</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <div className="tech-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="12" rx="2" stroke="#00FF7F" strokeWidth="2" fill="none"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#00FF7F"/>
                    <path d="M12 11L15 8L21 14" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 18L12 18" stroke="#064E3B" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="18" cy="18" r="2" stroke="#00FF7F" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <h3>Computer Vision</h3>
                <p>Advanced image processing algorithms analyze crop photos to identify disease patterns and symptoms</p>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#00FF7F"/>
                    <path d="M2 17L12 22L22 17" stroke="#064E3B" strokeWidth="2" fill="none"/>
                    <path d="M2 12L12 17L22 12" stroke="#064E3B" strokeWidth="2" fill="none"/>
                    <circle cx="8" cy="9" r="1" fill="#064E3B"/>
                    <circle cx="16" cy="9" r="1" fill="#064E3B"/>
                    <circle cx="12" cy="15" r="1" fill="#064E3B"/>
                  </svg>
                </div>
                <h3>Deep Learning</h3>
                <p>Neural networks trained on thousands of crop disease images for accurate diagnosis</p>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="#00FF7F"/>
                    <path d="M12 7C10.9 7 10 7.9 10 9V15C10 16.1 10.9 17 12 17C13.1 17 14 16.1 14 15V9C14 7.9 13.1 7 12 7Z" fill="#064E3B"/>
                    <circle cx="12" cy="20" r="2" fill="#00FF7F"/>
                    <path d="M8 12H16" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Expert Knowledge Base</h3>
                <p>Comprehensive database of treatment recommendations from agricultural experts and research</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="12" rx="2" stroke="#00FF7F" strokeWidth="2" fill="none"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#00FF7F"/>
                    <path d="M12 11L15 8L21 14" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-number">25,000+</div>
                <div className="stat-label">Images Analyzed</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#00FF7F" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="#064E3B" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="stat-number">95%</div>
                <div className="stat-label">Detection Accuracy</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13H9L11 7L13 17L15 11H21" stroke="#00FF7F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <circle cx="7" cy="13" r="2" fill="#064E3B"/>
                    <circle cx="17" cy="11" r="2" fill="#064E3B"/>
                  </svg>
                </div>
                <div className="stat-number">50+</div>
                <div className="stat-label">Disease Types Detected</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.27L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z" fill="#FFD700"/>
                  </svg>
                </div>
                <div className="stat-number">4.8</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
