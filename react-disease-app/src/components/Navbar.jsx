import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../public/logo.svg';

<<<<<<< Updated upstream
const Navbar = ({ currentPage, onNavigateToHome, onNavigateToPredict, onNavigateToFertilizer, onNavigateToAbout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
=======
const Navbar = ({ currentPage, onNavigateToHome, onNavigateToPredict, onNavigateToAbout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
        
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
>>>>>>> Stashed changes
        </div>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}>
            <div className="nav-link" onClick={() => handleNavigation(onNavigateToHome)}>Home</div>
          </li>
          <li className={`nav-item ${currentPage === 'predict' ? 'active' : ''}`}>
            <div className="nav-link" onClick={() => handleNavigation(onNavigateToPredict)}>Disease Prediction</div>
          </li>
          <li className={`nav-item ${currentPage === 'about' ? 'active' : ''}`}>
            <div className="nav-link" onClick={() => handleNavigation(onNavigateToAbout)}>About</div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
