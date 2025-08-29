import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, onNavigateToHome, onNavigateToPredict, onNavigateToFertilizer, onNavigateToAbout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (page, handler) => {
    handler();
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => handleNavigation('home', onNavigateToHome)}>
          <img 
            src="/logo.svg" 
            alt="CropSense AI Logo" 
            className="navbar-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="navbar-title">CropSense AI</span>
        </div>
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavigation('home', onNavigateToHome)}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'predict' ? 'active' : ''}`}
                onClick={() => handleNavigation('predict', onNavigateToPredict)}
              >
                Disease Prediction
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'fertilizer' ? 'active' : ''}`}
                onClick={() => handleNavigation('fertilizer', onNavigateToFertilizer)}
              >
                Fertilizer Prediction
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                onClick={() => handleNavigation('about', onNavigateToAbout)}
              >
                About
              </button>
            </li>
          </ul>
        </div>
        <div className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
