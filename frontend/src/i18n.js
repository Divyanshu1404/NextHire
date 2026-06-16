import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "navbar": {
        "jobs": "JOBS",
        "companies": "COMPANIES",
        "dashboard": "Dashboard",
        "login": "Login",
        "signUp": "Sign Up",
        "employers": "EMPLOYERS",
        "profile": "Profile",
        "logout": "Logout"
      },
      "home": {
        "title": "Find Your Dream Job Today",
        "subtitle": "Connecting talented professionals with the world's leading companies."
      }
    }
  },
  hi: {
    translation: {
      "navbar": {
        "jobs": "नौकरियां",
        "companies": "कंपनियां",
        "dashboard": "डैशबोर्ड",
        "login": "लॉगिन",
        "signUp": "साइन अप",
        "employers": "नियोक्ता",
        "profile": "प्रोफ़ाइल",
        "logout": "लॉगआउट"
      },
      "home": {
        "title": "आज ही अपनी सपनों की नौकरी पाएं",
        "subtitle": "प्रतिभाशाली पेशेवरों को दुनिया की अग्रणी कंपनियों से जोड़ना।"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
