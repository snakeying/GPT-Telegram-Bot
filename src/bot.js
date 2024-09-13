const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN, WHITELISTED_USERS, OPENAI_MODELS, DEFAULT_MODEL } = require('./config');
const { generateResponse } = require('./api');
const { getConversationHistory, addToConversationHistory, clearConversationHistory } = require('./redis');
const { generateImage, VALID_SIZES } = require('./generateImage');

let currentModel = DEFAULT_MODEL;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  cancellation: true
});

async function handleStart(msg) {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, `Welcome! The current model is ${currentModel}. Send me a message and I will generate a response using AI.`, {parse_mode: 'Markdown'});
    console.log('Start message sent successfully');
  } catch (error) {
    console.error('Error sending start message:', error);
  }
}

async function handleNew(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    await clearConversationHistory(userId);
    await bot.sendMessage(chatId, `New conversation started with model ${currentModel}. Previous context has been cleared.`, {parse_mode: 'Markdown'});
    console.log('New conversation message sent successfully');
  } catch (error) {
    console.error('Error handling new conversation:', error);
  }
}

async function handleHistory(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const history = await getConversationHistory(userId);
    const historyText = history.map(m => `${m.role}: ${m.content}`).join('\n\n');
    await bot.sendMessage(chatId, `Your conversation history:\n\n${historyText}`, {parse_mode: 'Markdown'});
  } catch (error) {
    console.error('Error retrieving conversation history:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error retrieving your conversation history.', {parse_mode: 'Markdown'});
  }
}

async function handleHelp(msg) {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, '等待补充', {parse_mode: 'Markdown'});
  } catch (error) {
    console.error('Error sending help message:', error);
  }
}

async function handleSwitchModel(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const args = msg.text.split(' ');
  
  if (args.length < 2) {
    await bot.sendMessage(chatId, 'Please provide a model name to switch to.', {parse_mode: 'Markdown'});
    return;
  }

  const modelName = args[1].trim();
  
  if (OPENAI_MODELS.includes(modelName)) {
    currentModel = modelName;
    await clearConversationHistory(userId);
    await bot.sendMessage(chatId, `Model switched to: ${modelName}. Previous conversation has been cleared.`, {parse_mode: 'Markdown'});
  } else {
    await bot.sendMessage(chatId, `Invalid model name. Use /help to see available models.`, {parse_mode: 'Markdown'});
  }
}

async function handleImageGeneration(msg) {
  const chatId = msg.chat.id;
  const args = msg.text.split(' ');
  args.shift(); // 移除 "/img" 命令

  let size = '1024x1024';
  let prompt;

  if (VALID_SIZES.includes(args[args.length - 1])) {
    size = args.pop();
    prompt = args.join(' ');
  } else {
    prompt = args.join(' ');
  }

  try {
    await bot.sendChatAction(chatId, 'upload_photo');
    console.log(`Generating image with prompt: "${prompt}" and size: ${size}`);
    const imageUrl = await generateImage(prompt, size);
    console.log(`Image URL generated: ${imageUrl}`);
    
    if (imageUrl) {
      console.log('Sending photo...');
      await bot.sendPhoto(chatId, imageUrl, { caption: prompt });
      console.log('Photo sent successfully');
    } else {
      throw new Error('未能获取图片URL');
    }
  } catch (error) {
    console.error('图片生成或发送错误:', error);
    await bot.sendMessage(chatId, `生成或发送图片时出错: ${error.message}`);
  }
}

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    if (!WHITELISTED_USERS.includes(userId)) {
      await bot.sendMessage(chatId, 'Sorry, you are not authorized to use this bot.', {parse_mode: 'Markdown'});
      return;
    }

    if (msg.text === '/new') {
      await handleNew(msg);
    } else if (msg.text === '/history') {
      await handleHistory(msg);
    } else if (msg.text === '/help') {
      await handleHelp(msg);
    } else if (msg.text.startsWith('/switchmodel')) {
      await handleSwitchModel(msg);
    } else if (msg.text.startsWith('/img')) {
      await handleImageGeneration(msg);
      // 注意：我们不在这里添加图片生成命令到对话历史
    } else if (msg.text && !msg.text.startsWith('/')) {
      await bot.sendChatAction(chatId, 'typing');
      const conversationHistory = await getConversationHistory(userId);
      const response = await generateResponse(msg.text, conversationHistory, currentModel);
      await addToConversationHistory(userId, msg.text, response);
      await bot.sendMessage(chatId, response, {parse_mode: 'Markdown'});
    } else {
      console.log('Received non-text or unknown command message');
    }
  } catch (error) {
    console.error('Error in handleMessage:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error processing your message. Please try again later.', {parse_mode: 'Markdown'});
  }
}

module.exports = { bot, handleMessage, handleStart };
