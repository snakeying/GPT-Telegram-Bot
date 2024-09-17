const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

const defaultLanguage = 'en';
const supportedLanguages = ['en', 'zh-cn', 'zh-hant', 'ja', 'es', 'fr', 'ru', 'de'];

let translations = {};

// Load all language files
supportedLanguages.forEach(lang => {
  const filePath = path.join(__dirname, '..', 'locales', `${lang}.json`);
  translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REST_TOKEN,
});

async function getUserLanguage(userId) {
  const lang = await redis.get(`user_lang:${userId}`);
  return lang || defaultLanguage;
}

async function setUserLanguage(userId, language) {
  if (supportedLanguages.includes(language)) {
    await redis.set(`user_lang:${userId}`, language, { ex: 31536000 }); // 1 year TTL
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

const commandKeys = ['start', 'new', 'history', 'help', 'switchmodel', 'img', 'language'];

async function getLocalizedCommands(userId) {
  const userLang = await getUserLanguage(userId);
  return commandKeys.map(key => ({
    command: key,
    description: translate(`cmd_${key}`, userLang)
  }));
}

module.exports = { getUserLanguage, setUserLanguage, translate, supportedLanguages, getLocalizedCommands };
