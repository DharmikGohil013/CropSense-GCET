import React from 'react';
import './About.css';

const About = ({ onNavigateToPredict }) => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-hero-title">About <span className="brand-highlight">CropSense AI</span></h1>
            <p className="about-hero-description">
              Empowering farmers with AI-powered crop disease detection technology
            </p>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-text">
              At CropSense AI, we're dedicated to revolutionizing agriculture through accessible technology. 
              Our mission is to provide farmers, agricultural professionals, and gardening enthusiasts 
              with tools that make crop disease detection fast, accurate, and accessible to everyone, 
              regardless of their technical expertise.
            </p>
            <div className="mission-values">
              <div className="mission-value">
                <div className="value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M16.24 7.76a6 6 0 0 1 0 8.48" />
                    <path d="M7.76 16.24a6 6 0 0 1 0-8.48" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h3>Accessibility</h3>
                <p>Making advanced technology available to all farmers</p>
              </div>
              <div className="mission-value">
                <div className="value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4" />
                    <path d="M12 18v4" />
                    <path d="M4.93 4.93l2.83 2.83" />
                    <path d="M16.24 16.24l2.83 2.83" />
                    <path d="M2 12h4" />
                    <path d="M18 12h4" />
                    <path d="M4.93 19.07l2.83-2.83" />
                    <path d="M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <h3>Innovation</h3>
                <p>Continuously improving our AI models for better accuracy</p>
              </div>
              <div className="mission-value">
                <div className="value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3>Reliability</h3>
                <p>Providing dependable results farmers can trust</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How CropSense AI Works</h2>
          <div className="process-flow">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Capture</h3>
                <p className="step-description">
                  Take a clear photo of the affected crop leaf with your smartphone or camera
                </p>
                <div className="step-image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="16" cy="8" r="1" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="process-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Upload</h3>
                <p className="step-description">
                  Upload the image to CropSense AI through our simple interface
                </p>
                <div className="step-image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="process-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Analyze</h3>
                <p className="step-description">
                  Our AI model analyzes the image to identify the crop and detect diseases
                </p>
                <div className="step-image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="process-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Results</h3>
                <p className="step-description">
                  Get detailed information about the disease and recommended treatments
                </p>
                <div className="step-image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="technology-section">
        <div className="container">
          <div className="tech-content">
            <h2 className="section-title">Our Technology</h2>
            <div className="tech-grid">
              <div className="tech-card">
                <div className="tech-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M8.5 10.5L5 14h14l-4.5-6-3.5 4.5L8.5 10.5z" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                  </svg>
                </div>
                <h3 className="tech-title">Computer Vision</h3>
                <p className="tech-description">
                  Advanced image recognition algorithms identify visual patterns associated with various crop diseases
                </p>
              </div>
              <div className="tech-card">
                <div className="tech-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    <path d="M3.6 9h16.8" />
                    <path d="M3.6 15h16.8" />
                    <path d="M11.5 3a17 17 0 0 0 0 18" />
                    <path d="M12.5 3a17 17 0 0 1 0 18" />
                  </svg>
                </div>
                <h3 className="tech-title">Deep Learning</h3>
                <p className="tech-description">
                  Neural networks trained on thousands of crop disease images enable precise detection and classification
                </p>
              </div>
              <div className="tech-card">
                <div className="tech-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <h3 className="tech-title">Cloud Processing</h3>
                <p className="tech-description">
                  Powerful cloud infrastructure ensures fast and reliable disease detection even on mobile devices
                </p>
              </div>
              <div className="tech-card">
                <div className="tech-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <line x1="12" y1="17" x2="12" y2="17.01" />
                    <path d="M12 13.5V14h.01v.01H12v-.01z" />
                    <path d="M12 7h.01v5H12V7z" />
                  </svg>
                </div>
                <h3 className="tech-title">Expert Knowledge</h3>
                <p className="tech-description">
                  Disease information and treatment recommendations curated by agricultural experts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="accuracy-section">
        <div className="container">
          <div className="accuracy-content">
            <h2 className="section-title">Accuracy & Reliability</h2>
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-value">95%+</div>
                <div className="stat-label">Detection Accuracy</div>
                <p className="stat-description">
                  Our AI model achieves over 95% accuracy in identifying common crop diseases
                </p>
              </div>
              <div className="stat-item">
                <div className="stat-value">38</div>
                <div className="stat-label">Supported Crops</div>
                <p className="stat-description">
                  CropSense AI can analyze diseases across 38 different crop varieties
                </p>
              </div>
              <div className="stat-item">
                <div className="stat-value">100+</div>
                <div className="stat-label">Disease Types</div>
                <p className="stat-description">
                  Our system can detect over 100 different crop diseases and nutrient deficiencies
                </p>
              </div>
            </div>
            <div className="accuracy-note">
              <p>
                While CropSense AI provides highly accurate disease detection, we recommend consulting with
                agricultural experts for confirmation and treatment plans for severe infestations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Farmers Say</h2>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "CropSense AI helped me identify a tomato blight infestation early, saving over half my crop. 
                  The treatment recommendations were spot-on and easy to implement."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="author-info">
                  <h4 className="author-name">Rajesh Patel</h4>
                  <p className="author-role">Tomato Farmer, Gujarat</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "As a small-scale farmer, I couldn't afford expensive consultations. CropSense AI gives me 
                  professional disease diagnoses right from my phone, and it's incredibly accurate."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="author-info">
                  <h4 className="author-name">Anita Sharma</h4>
                  <p className="author-role">Rice Farmer, Punjab</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "The speed and accuracy of CropSense AI is impressive. What used to take days of waiting for expert 
                  visits now happens in seconds. It's transformed how I manage disease control."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="author-info">
                  <h4 className="author-name">Mohan Verma</h4>
                  <p className="author-role">Cotton Farmer, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            <div className="faq-item">
              <h3 className="faq-question">How accurate is CropSense AI?</h3>
              <p className="faq-answer">
                CropSense AI achieves over 95% accuracy for most common crop diseases. The system is continuously 
                trained on new data to improve its performance across different crops and disease variants.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What crops can CropSense AI identify?</h3>
              <p className="faq-answer">
                Currently, CropSense AI supports 38 different crop types including rice, wheat, corn, cotton, tomato, 
                potato, and many other common agricultural crops. We're constantly expanding our database.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do I need an internet connection to use CropSense AI?</h3>
              <p className="faq-answer">
                Yes, CropSense AI requires an internet connection to analyze images. The image processing happens 
                on our secure cloud servers to ensure high accuracy and performance.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Is my data secure when I use CropSense AI?</h3>
              <p className="faq-answer">
                Absolutely. We prioritize user privacy and data security. Images are processed securely and not stored 
                permanently on our servers. We use encryption to protect all data transmissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to protect your crops?</h2>
            <p className="cta-description">
              Try CropSense AI today and experience the power of AI-driven crop disease detection
            </p>
            <button 
              className="cta-button"
              onClick={onNavigateToPredict}
            >
              Start Disease Detection
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
