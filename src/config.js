require('dotenv').config();

module.exports = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  OPENAI_MODELS: process.env.OPENAI_MODELS ? process.env.OPENAI_MODELS.split(',').map(model => model.trim()) : [],
  DEFAULT_MODEL: process.env.OPENAI_MODELS ? process.env.OPENAI_MODELS.split(',').map(model => model.trim())[0] : null,  // 默认使用第一个模型
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  WHITELISTED_USERS: process.env.WHITELISTED_USERS ? process.env.WHITELISTED_USERS.split(',').map(id => parseInt(id.trim())) : [],
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REST_TOKEN,
};
