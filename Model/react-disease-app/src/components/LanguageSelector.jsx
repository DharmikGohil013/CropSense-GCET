import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { languages, getCurrentLanguage, changeLanguage } = useLanguage();
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (language) => {
    changeLanguage(language.code);
  };

  return (
    <div className="language-selector">
      <div className="translate-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
            fill="currentColor"
          />
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
  );
};

export default LanguageSelector;
