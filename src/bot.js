const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN, WHITELISTED_USERS } = require('./config');
const { generateResponseStream } = require('./api');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

function cleanMarkdown(text) {
  // 确保代码块被正确闭合
  let openCodeBlocks = (text.match(/```/g) || []).length;
  if (openCodeBlocks % 2 !== 0) {
    text += '\n```';
  }

  // 确保内联代码被正确闭合
  let openInlineCode = (text.match(/`/g) || []).length;
  if (openInlineCode % 2 !== 0) {
    text += '`';
  }

  // 确保粗体和斜体标记被正确闭合
  ['*', '_'].forEach(char => {
    let count = (text.match(new RegExp('\\' + char, 'g')) || []).length;
    if (count % 2 !== 0) {
      text += char;
    }
  });

  return text;
}

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
      let lastSentResponse = '';

      for await (const partialResponse of generateResponseStream(msg.text)) {
        fullResponse += partialResponse;
        
        const cleanedResponse = cleanMarkdown(fullResponse);
        
        if (cleanedResponse.length > 4000 || cleanedResponse.length % 20 === 0 || partialResponse.includes('\n')) {
          if (cleanedResponse !== lastSentResponse) {
            if (lastMessageId) {
              try {
                await bot.editMessageText(cleanedResponse, { chat_id: chatId, message_id: lastMessageId, parse_mode: 'Markdown' });
              } catch (error) {
                if (error.response && error.response.body && error.response.body.description !== 'Bad Request: message is not modified') {
                  console.error('Error editing message:', error);
                }
              }
            } else {
              const sentMsg = await bot.sendMessage(chatId, cleanedResponse, { parse_mode: 'Markdown' });
              lastMessageId = sentMsg.message_id;
            }
            lastSentResponse = cleanedResponse;
          }

          if (cleanedResponse.length > 4000) {
            fullResponse = '';
            lastMessageId = null;
          }
        }
      }

      // 发送或更新最终消息
      if (fullResponse && fullResponse !== lastSentResponse) {
        const finalCleanedResponse = cleanMarkdown(fullResponse);
        if (lastMessageId) {
          try {
            await bot.editMessageText(finalCleanedResponse, { chat_id: chatId, message_id: lastMessageId, parse_mode: 'Markdown' });
          } catch (error) {
            if (error.response && error.response.body && error.response.body.description !== 'Bad Request: message is not modified') {
              console.error('Error editing final message:', error);
            }
          }
        } else {
          await bot.sendMessage(chatId, finalCleanedResponse, { parse_mode: 'Markdown' });
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
