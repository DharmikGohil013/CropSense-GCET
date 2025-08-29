import React from 'react';
import './Home.css';

const Home = ({ onNavigateToPredict }) => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="brand-highlight">CropSense AI</span>
            </h1>
            <p className="hero-subtitle">
              Advanced AI-powered crop disease detection for modern agriculture
            </p>
            <p className="hero-description">
              Upload an image of your crop leaves and get instant, accurate disease 
              identification with detailed information and recommendations.
            </p>
            <button 
              className="cta-button"
              onClick={onNavigateToPredict}
            >
              Start Disease Detection
            </button>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <svg viewBox="0 0 200 200" className="hero-svg">
                <defs>
                  <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7fb069" />
                    <stop offset="100%" stopColor="#4a7c59" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#leafGradient)" opacity="0.1" />
                <path d="M60 120 Q70 70 100 80 Q130 70 140 120 Q130 150 100 140 Q70 150 60 120 Z" 
                      fill="url(#leafGradient)" />
                <path d="M100 80 L100 140" stroke="#2c5530" strokeWidth="2" />
                <path d="M100 90 Q85 100 90 110" stroke="#2c5530" strokeWidth="1" fill="none" />
                <path d="M100 90 Q115 100 110 110" stroke="#2c5530" strokeWidth="1" fill="none" />
                <circle cx="70" cy="50" r="3" fill="#ffffff" />
                <circle cx="85" cy="40" r="2" fill="#ffffff" />
                <circle cx="115" cy="40" r="2" fill="#ffffff" />
                <circle cx="130" cy="50" r="3" fill="#ffffff" />
                <path d="M70 50 L85 40 M85 40 L115 40 M115 40 L130 50" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose CropSense AI?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" />
                  <polyline points="9,11 12,14 15,11" />
                  <line x1="12" y1="14" x2="12" y2="2" />
                </svg>
              </div>
              <h3 className="feature-title">Easy Upload</h3>
              <p className="feature-description">
                Simply upload an image of your crop leaf and get instant results
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6" />
                  <path d="m4.22 4.22 1.42 1.42m0 11.31-1.42 1.42" />
                  <path d="M1 12h6m6 0h6" />
                  <path d="m4.22 19.78 1.42-1.42m0-11.31-1.42-1.42" />
                </svg>
              </div>
              <h3 className="feature-title">AI-Powered Analysis</h3>
              <p className="feature-description">
                Advanced machine learning algorithms for accurate disease detection
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                </svg>
              </div>
              <h3 className="feature-title">Instant Results</h3>
              <p className="feature-description">
                Get detailed crop and disease information within seconds
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                  <rect x="2" y="9" width="20" height="11" rx="2" ry="2" />
                </svg>
              </div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your data is processed securely and not stored on our servers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Upload Image</h3>
              <p className="step-description">
                Take a clear photo of the affected crop leaf and upload it
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">AI Analysis</h3>
              <p className="step-description">
                Our AI analyzes the image to identify crop type and diseases
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Get Results</h3>
              <p className="step-description">
                Receive detailed information about the crop and any detected diseases
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <div className="container">
          <div className="about-content">
            <h2 className="section-title">About CropSense AI</h2>
            <p className="about-text">
              CropSense AI is designed to help farmers, agricultural professionals, and 
              gardening enthusiasts quickly identify crop diseases using cutting-edge 
              artificial intelligence. Our system can detect various plant diseases 
              from simple leaf images, providing valuable insights for crop management 
              and treatment decisions.
            </p>
            <p className="about-text">
              With our easy-to-use interface and powerful AI backend, you can make 
              informed decisions about your crops and take preventive measures to 
              protect your harvest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
