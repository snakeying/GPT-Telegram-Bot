const fs = require('fs');
const path = require('path');

const defaultLanguage = 'en';
const supportedLanguages = ['en', 'zh-cn'];

let translations = {};
let userLanguages = {};

// Load all language files
supportedLanguages.forEach(lang => {
  const filePath = path.join(__dirname, '..', 'locales', `${lang}.json`);
  translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

function getUserLanguage(userId, telegramLanguageCode) {
  if (!userLanguages[userId]) {
    // If user hasn't set a language, use Telegram's language code or default to English
    const shortLangCode = telegramLanguageCode ? telegramLanguageCode.split('-')[0] : defaultLanguage;
    userLanguages[userId] = supportedLanguages.includes(shortLangCode) ? shortLangCode : defaultLanguage;
  }
  return userLanguages[userId];
}

function setUserLanguage(userId, language) {
  const shortLangCode = language.split('-')[0];
  if (supportedLanguages.includes(shortLangCode)) {
    userLanguages[userId] = shortLangCode;
    return true;
  }
  return false;
}

function translate(key, language, params = {}) {
  let text = translations[language]?.[key] || translations[defaultLanguage][key] || key;
  
  // Replace parameters
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
}

module.exports = { getUserLanguage, setUserLanguage, translate, supportedLanguages };
