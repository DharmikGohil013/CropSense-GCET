import React from 'react';
import './Navbar.css';
import logo from '../crop-logo.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const { t } = useTranslation();
  const { languages, getCurrentLanguage, changeLanguage } = useLanguage();
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (language) => {
    changeLanguage(language.code);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Language Selector */}
        <div className="language-selector">
          <div className="translate-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="language-dropdown">
            <div className="current-language">
              <span>{currentLang.name}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="language-panel">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`language-option ${currentLang.code === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(language)}
                >
                  <span className="language-name">{language.name}</span>
                  <span className="language-native">{language.native}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="nav-links">
          <li className="nav-item">
            <Link to="/" className="nav-trigger overview-link">{t('navbar.overview')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/info-to-disease" className="nav-trigger">{t('navbar.diseaseInfo')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/image-to-disease" className="nav-trigger">{t('navbar.diseaseImage')}</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <Link to="/" className="app-brand" aria-label="Go to Home">
          <img src={logo} alt="CropSense AI Logo" className="navbar-logo" />
          <span className="app-name">{t('navbar.brandName')}</span>
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;
