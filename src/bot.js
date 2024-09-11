const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN, WHITELISTED_USERS } = require('./config');
const { generateResponse } = require('./api');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! Send me a message and I\'ll generate a response using AI.');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!WHITELISTED_USERS.includes(userId)) {
    bot.sendMessage(chatId, 'Sorry, you are not authorized to use this bot.');
    return;
  }

  if (msg.text && !msg.text.startsWith('/')) {
    try {
      const response = await generateResponse(msg.text);
      bot.sendMessage(chatId, response);
    } catch (error) {
      bot.sendMessage(chatId, 'Sorry, there was an error generating the response. Please try again later.');
    }
  }
});

module.exports = bot;
