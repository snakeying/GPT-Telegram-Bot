const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN, WHITELISTED_USERS } = require('./config');
const { generateResponseStream } = require('./api');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

bot.onText(/\/start/, (msg) => {
  console.log('Received /start command');
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! Send me a message and I\'ll generate a response using AI.')
    .catch(error => console.error('Error sending start message:', error));
});

async function handleMessage(msg) {
  console.log('Handling message:', JSON.stringify(msg));
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    if (!WHITELISTED_USERS.includes(userId)) {
      console.log('User not whitelisted:', userId);
      console.log('Whitelisted users:', WHITELISTED_USERS);
      await bot.sendMessage(chatId, 'Sorry, you are not authorized to use this bot.');
      return;
    }

    if (msg.text && !msg.text.startsWith('/')) {
      console.log('Generating response for:', msg.text);
      let fullResponse = '';
      let messageId = null;

      for await (const partialResponse of generateResponseStream(msg.text)) {
        fullResponse += partialResponse;

        if (messageId) {
          await bot.editMessageText(fullResponse, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown'
          }).catch(error => {
            if (error.response && error.response.body && error.response.body.description !== 'Bad Request: message is not modified') {
              console.error('Error editing message:', error);
            }
          });
        } else {
          const sentMsg = await bot.sendMessage(chatId, fullResponse, { parse_mode: 'Markdown' });
          messageId = sentMsg.message_id;
        }
      }

      console.log('Response sent successfully');
    } else {
      console.log('Received non-text or command message');
    }
  } catch (error) {
    console.error('Error in handleMessage:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error processing your message. Please try again later.')
      .catch(sendError => console.error('Error sending error message:', sendError));
  }
}

module.exports = { bot, handleMessage };
