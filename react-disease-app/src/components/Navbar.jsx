import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../public/logo.svg';

<<<<<<< Updated upstream
const Navbar = ({ currentPage, onNavigateToHome, onNavigateToPredict, onNavigateToFertilizer, onNavigateToAbout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
=======
const Navbar = ({ currentPage, onNavigateToHome, onNavigateToPredict, onNavigateToAbout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (navFunction) => {
    navFunction();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleNavigation(onNavigateToHome)}>
          <img src={logo} alt="CropSense Logo" />
          <span>CropSense</span>
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
