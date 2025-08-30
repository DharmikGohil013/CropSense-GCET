import { useTranslation } from 'react-i18next';

// Helper function to translate dynamic content like disease results
export const useResultTranslation = () => {
  const { i18n } = useTranslation();

  const translateResult = async (result) => {
    if (!result || i18n.language === 'en') {
      return result;
    }

    // For now, we'll return the original result
    // In a real implementation, you might want to:
    // 1. Use a translation API like Google Translate
    // 2. Have pre-translated disease names and descriptions
    // 3. Use AI translation services
    
    try {
      // Placeholder for future translation implementation
      // You could integrate with translation APIs here
      return result;
    } catch (error) {
      console.error('Translation error:', error);
      return result;
    }
  };

  const translateText = async (text) => {
    if (!text || i18n.language === 'en') {
      return text;
    }

    // Placeholder for text translation
    // You could integrate translation APIs here
    return text;
  };

  return {
    translateResult,
    translateText,
    currentLanguage: i18n.language
  };
};

// Common crop disease names in different languages
export const cropDiseaseTranslations = {
  en: {
    // Rice diseases
    'Rice Blast': 'Rice Blast',
    'Brown Spot': 'Brown Spot',
    'Leaf Blight': 'Leaf Blight',
    'Healthy': 'Healthy',
    // Common terms
    'High': 'High',
    'Medium': 'Medium',
    'Low': 'Low',
    'Mild': 'Mild',
    'Severe': 'Severe',
    'Moderate': 'Moderate',
  },
  hi: {
    // Rice diseases in Hindi
    'Rice Blast': 'चावल ब्लास्ट',
    'Brown Spot': 'भूरे धब्बे',
    'Leaf Blight': 'पत्ती झुलसन',
    'Healthy': 'स्वस्थ',
    // Common terms
    'High': 'उच्च',
    'Medium': 'मध्यम',
    'Low': 'कम',
    'Mild': 'हल्का',
    'Severe': 'गंभीर',
    'Moderate': 'मध्यम',
  },
  gu: {
    // Rice diseases in Gujarati
    'Rice Blast': 'ચોખા બ્લાસ્ટ',
    'Brown Spot': 'ભૂરા ડાઘ',
    'Leaf Blight': 'પાન બ્લાઇટ',
    'Healthy': 'સ્વસ્થ',
    // Common terms
    'High': 'ઉચ્ચ',
    'Medium': 'મધ્યમ',
    'Low': 'નીચું',
    'Mild': 'હળવું',
    'Severe': 'ગંભીર',
    'Moderate': 'મધ્યમ',
  }
};

export const getTranslatedDiseaseName = (diseaseName, language = 'en') => {
  const translations = cropDiseaseTranslations[language];
  return translations?.[diseaseName] || diseaseName;
};

export const getTranslatedSeverity = (severity, language = 'en') => {
  const translations = cropDiseaseTranslations[language];
  return translations?.[severity] || severity;
};
