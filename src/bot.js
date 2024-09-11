const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN, WHITELISTED_USERS } = require('./config');
const { generateResponse } = require('./api');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

bot.onText(/\/start/, async (msg) => {
  console.log('Received /start command');
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, 'Welcome! Send me a message and I\'ll generate a response using AI.', {parse_mode: 'Markdown'});
    console.log('Start message sent successfully');
  } catch (error) {
    console.error('Error sending start message:', error);
  }
});

async function handleMessage(msg) {
  console.log('Handling message:', JSON.stringify(msg));
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    if (!WHITELISTED_USERS.includes(userId)) {
      console.log('User not whitelisted:', userId);
      console.log('Whitelisted users:', WHITELISTED_USERS);
      await bot.sendMessage(chatId, 'Sorry, you are not authorized to use this bot.', {parse_mode: 'Markdown'});
      return;
    }

    if (msg.text && !msg.text.startsWith('/')) {
      console.log('Generating response for:', msg.text);
      
      // Send "typing" action
      await bot.sendChatAction(chatId, 'typing');
      
      const response = await generateResponse(msg.text);
      console.log('Generated response:', response);
      
      // Send the response with Markdown parsing
      await bot.sendMessage(chatId, response, {parse_mode: 'Markdown'});
      console.log('Response sent successfully');
    } else {
      console.log('Received non-text or command message');
    }
  } catch (error) {
    console.error('Error in handleMessage:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error processing your message. Please try again later.', {parse_mode: 'Markdown'})
      .catch(sendError => console.error('Error sending error message:', sendError));
  }
}

module.exports = { bot, handleMessage };
