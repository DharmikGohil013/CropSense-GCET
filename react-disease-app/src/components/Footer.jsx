import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">🌱</div>
            </div>
            <div className="brand-info">
              <h3 className="footer-title">CROPSENSE AI</h3>
              <p className="footer-tagline">Smart Agriculture Solutions</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#image-to-disease">Image to Disease</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-center">
            <p className="footer-copyright">
              © 2025 CropSense AI. All rights reserved.
            </p>
          </div>
          <div className="footer-right">
            <a href="#about" className="about-link">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
