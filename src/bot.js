const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN, WHITELISTED_USERS } = require('./config');
const { generateResponse } = require('./api');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

bot.onText(/\/start/, (msg) => {
  console.log('Received /start command');
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! Send me a message and I\'ll generate a response using AI.')
    .catch(error => console.error('Error sending start message:', error));
});

bot.on('message', async (msg) => {
  console.log('Received message:', JSON.stringify(msg));
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!WHITELISTED_USERS.includes(userId)) {
    console.log('User not whitelisted:', userId);
    bot.sendMessage(chatId, 'Sorry, you are not authorized to use this bot.')
      .catch(error => console.error('Error sending unauthorized message:', error));
    return;
  }

  if (msg.text && !msg.text.startsWith('/')) {
    try {
      console.log('Generating response for:', msg.text);
      const response = await generateResponse(msg.text);
      console.log('Generated response:', response);
      await bot.sendMessage(chatId, response);
      console.log('Response sent successfully');
    } catch (error) {
      console.error('Error in message handling:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error generating the response. Please try again later.')
        .catch(sendError => console.error('Error sending error message:', sendError));
    }
  }
});

// Add error handler
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error);
});

module.exports = bot;
