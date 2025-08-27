import React from 'react';
import './Legal.css';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();
  
  return (
    <div className="legal-page">
      <h1>{t('privacy.title')}</h1>
      <p className="lead">{t('privacy.introText')}</p>

      <section>
        <h2>1. {t('privacy.dataCollection')}</h2>
        <p>{t('privacy.dataCollectionText')}</p>
      </section>

      <section>
        <h2>2. {t('privacy.dataUse')}</h2>
        <p>{t('privacy.dataUseText')}</p>
      </section>

      <section>
        <h2>3. {t('privacy.dataSharing')}</h2>
        <p>{t('privacy.dataSharingText')}</p>
      </section>

      <section>
        <h2>4. {t('privacy.dataStorage')}</h2>
        <p>{t('privacy.dataStorageText')}</p>
      </section>

      <section>
        <h2>5. {t('privacy.userRights')}</h2>
        <p>{t('privacy.userRightsText')}</p>
      </section>

      <section>
        <h2>6. {t('privacy.cookies')}</h2>
        <p>{t('privacy.cookiesText')}</p>
      </section>

      <section>
        <h2>7. {t('privacy.minors')}</h2>
        <p>{t('privacy.minorsText')}</p>
      </section>

      <section>
        <h2>8. {t('privacy.changes')}</h2>
        <p>{t('privacy.changesText')}</p>
      </section>

      <section>
        <h2>9. {t('privacy.contact')}</h2>
        <p>{t('privacy.contactText')} <a href={`mailto:${t('privacy.email')}`}>{t('privacy.email')}</a></p>
      </section>
    </div>
  );
};

export default Privacy;
