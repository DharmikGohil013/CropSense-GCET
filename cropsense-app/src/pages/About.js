import React from 'react';
import './About.css';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>{t('about.title')}</h1>
        <p>{t('about.subtitle')}</p>
      </div>

      <section className="about-grid">
        <div className="about-card">
          <h3>{t('about.mission')}</h3>
          <p>{t('about.missionText')}</p>
        </div>
        <div className="about-card">
          <h3>{t('about.features')}</h3>
          <div className="features-list">
            <div className="feature-item">
              <h4>{t('about.aiPowered')}</h4>
              <p>{t('about.aiPoweredDesc')}</p>
            </div>
            <div className="feature-item">
              <h4>{t('about.realTime')}</h4>
              <p>{t('about.realTimeDesc')}</p>
            </div>
            <div className="feature-item">
              <h4>{t('about.diseaseDetection')}</h4>
              <p>{t('about.diseaseDetectionDesc')}</p>
            </div>
          </div>
        </div>
        <div className="about-card">
          <h3>{t('about.vision')}</h3>
          <p>{t('about.visionText')}</p>
        </div>
        <div className="about-card">
          <h3>{t('about.technology')}</h3>
          <p>{t('about.technologyDesc')}</p>
        </div>
      </section>

      <section className="about-values">
        <h2>{t('about.contact')}</h2>
        <div className="values-row">
          <div className="value-item">
            <h4>{t('about.smartRecommendations')}</h4>
            <p>{t('about.smartRecommendationsDesc')}</p>
          </div>
          <div className="value-item">
            <h4>{t('about.yieldPrediction')}</h4>
            <p>{t('about.yieldPredictionDesc')}</p>
          </div>
          <div className="value-item">
            <h4>{t('about.dataAnalytics')}</h4>
            <p>{t('about.dataAnalyticsDesc')}</p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>{t('about.contact')}</h2>
        <p>{t('about.contactDesc')}</p>
        <a className="cta-button" href="mailto:info@cropsense.ai">{t('about.contact')}</a>
      </section>
    </div>
  );
};

export default About;
