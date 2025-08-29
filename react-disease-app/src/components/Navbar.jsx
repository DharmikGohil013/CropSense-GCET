import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, onNavigateToHome, onNavigateToPredict, onNavigateToFertilizer, onNavigateToAbout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (handler) => {
    handler();
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => handleNavClick(onNavigateToHome)}>
          <img src="/logo.svg" alt="CropSense Logo" />
          <span>CropSense AI</span>
        </div>
        
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <div 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick(onNavigateToHome)}
          >
            <i className="nav-icon-home"></i>
            Home
          </div>
          <div 
            className={`nav-item ${currentPage === 'predict' ? 'active' : ''}`}
            onClick={() => handleNavClick(onNavigateToPredict)}
          >
            <i className="nav-icon-disease"></i>
            Disease Prediction
          </div>
          <div 
            className={`nav-item ${currentPage === 'fertilizer' ? 'active' : ''}`}
            onClick={() => handleNavClick(onNavigateToFertilizer)}
          >
            <i className="nav-icon-fertilizer"></i>
            Fertilizer
          </div>
          <div 
            className={`nav-item ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick(onNavigateToAbout)}
          >
            <i className="nav-icon-about"></i>
            About
          </div>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
