require('dotenv').config();

const config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',  // Ensure this is set to a valid model
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  WHITELISTED_USERS: process.env.WHITELISTED_USERS ? process.env.WHITELISTED_USERS.split(',').map(id => parseInt(id.trim())) : [],
};

console.log('Configuration:', JSON.stringify(config, (key, value) => key === 'OPENAI_API_KEY' ? '[REDACTED]' : value));

module.exports = config;
