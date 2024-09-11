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
      let lastMessageId = null;

      for await (const partialResponse of generateResponseStream(msg.text)) {
        fullResponse += partialResponse;
        
        if (fullResponse.length > 4000) {
          // If the message is too long, send it and start a new one
          if (lastMessageId) {
            await bot.editMessageText(fullResponse, { chat_id: chatId, message_id: lastMessageId, parse_mode: 'Markdown' });
          } else {
            const sentMsg = await bot.sendMessage(chatId, fullResponse, { parse_mode: 'Markdown' });
            lastMessageId = sentMsg.message_id;
          }
          fullResponse = '';
        } else if (fullResponse.length % 20 === 0 || partialResponse.includes('\n')) {
          // Update the message every 20 characters or when there's a newline
          if (lastMessageId) {
            await bot.editMessageText(fullResponse, { chat_id: chatId, message_id: lastMessageId, parse_mode: 'Markdown' });
          } else {
            const sentMsg = await bot.sendMessage(chatId, fullResponse, { parse_mode: 'Markdown' });
            lastMessageId = sentMsg.message_id;
          }
        }
      }

      // Send or update the final message
      if (fullResponse) {
        if (lastMessageId) {
          await bot.editMessageText(fullResponse, { chat_id: chatId, message_id: lastMessageId, parse_mode: 'Markdown' });
        } else {
          await bot.sendMessage(chatId, fullResponse, { parse_mode: 'Markdown' });
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
