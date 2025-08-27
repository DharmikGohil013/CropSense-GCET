import React from 'react';
import './Legal.css';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation();
  
  return (
    <div className="legal-page">
      <h1>{t('terms.title')}</h1>
      <p className="lead">{t('terms.acceptanceText')}</p>

      <section>
        <h2>1. {t('terms.acceptance')}</h2>
        <p>{t('terms.acceptanceText')}</p>
      </section>

      <section>
        <h2>2. {t('terms.services')}</h2>
        <p>{t('terms.servicesText')}</p>
      </section>

      <section>
        <h2>3. {t('terms.userResponsibilities')}</h2>
        <p>{t('terms.userResponsibilitiesText')}</p>
      </section>

      <section>
        <h2>4. {t('terms.intellectualProperty')}</h2>
        <p>{t('terms.intellectualPropertyText')}</p>
      </section>

      <section>
        <h2>5. {t('terms.limitations')}</h2>
        <p>{t('terms.limitationsText')}</p>
      </section>

      <section>
        <h2>6. {t('terms.termination')}</h2>
        <p>{t('terms.terminationText')}</p>
      </section>

      <section>
        <h2>7. {t('terms.changes')}</h2>
        <p>{t('terms.changesText')}</p>
      </section>

      <section>
        <h2>8. {t('terms.contact')}</h2>
        <p>{t('terms.contactText')} <a href={`mailto:${t('terms.email')}`}>{t('terms.email')}</a></p>
      </section>
    </div>
  );
};

export default Terms;
