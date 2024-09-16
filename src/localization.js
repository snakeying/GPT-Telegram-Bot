const fs = require('fs');
const path = require('path');

const defaultLanguage = 'en';
const supportedLanguages = ['en', 'zh-cn'];

let translations = {};
let userLanguages = {};

// 加载所有语言文件
supportedLanguages.forEach(lang => {
  const filePath = path.join(__dirname, '..', 'locales', `${lang}.json`);
  translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

function getUserLanguage(userId) {
  return userLanguages[userId] || defaultLanguage;
}

function setUserLanguage(userId, language) {
  if (supportedLanguages.includes(language)) {
    userLanguages[userId] = language;
    return true;
  }
  return false;
}

function translate(key, language, params = {}) {
  let text = translations[language]?.[key] || translations[defaultLanguage][key] || key;
  
  // 替换参数
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
}

module.exports = { getUserLanguage, setUserLanguage, translate, supportedLanguages };
