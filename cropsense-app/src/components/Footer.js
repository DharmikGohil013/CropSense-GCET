import React from 'react';
import './Footer.css';
import logo from '../crop-logo.svg';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="CropSense AI" className="footer-logo" />
          <div>
            <h2 className="footer-title">{t('footer.brandName')}</h2>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              <li><Link to="/">{t('footer.home')}</Link></li>
              <li><Link to="/about">{t('footer.about')}</Link></li>
              <li><Link to="/image-to-disease">{t('navbar.diseaseImage')}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.support')}</h4>
            <ul>
              <li><a href="#docs">{t('footer.documentation')}</a></li>
              <li><a href="#community">{t('footer.community')}</a></li>
              <li><a href="#api">{t('footer.api')}</a></li>
              <li><a href="#forum">{t('footer.forum')}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.contact')}</h4>
            <ul>
              <li><a href="mailto:info@cropsense.ai">info@cropsense.ai</a></li>
              <li><a href="#feedback">{t('common.help')}</a></li>
              <li><a href="#social">{t('footer.social')}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} {t('footer.brandName')}. {t('footer.allRightsReserved')}.</p>
        <div className="legal-links">
          <Link to="/privacy">{t('footer.privacy')}</Link>
          <span>•</span>
          <Link to="/terms">{t('footer.terms')}</Link>
          <span>•</span>
          <Link to="/about">{t('footer.about')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
