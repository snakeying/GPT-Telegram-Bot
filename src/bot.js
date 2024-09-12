const TelegramBot = require('node-telegram-bot-api'); 
const { TELEGRAM_BOT_TOKEN, WHITELISTED_USERS, OPENAI_MODELS, DEFAULT_MODEL } = require('./config');
const { generateResponse, generateImage } = require('./api');
const { getConversationHistory, addToConversationHistory, clearConversationHistory } = require('./redis');

// 当前模型，初始值为默认模型
let currentModel = DEFAULT_MODEL;

// 创建 Telegram bot 实例
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  cancellation: true  // 启用取消 promise 的功能
});

// 处理 /start 命令
async function handleStart(msg) {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, `Welcome! The current model is ${currentModel}. Send me a message and I will generate a response using AI.`, {parse_mode: 'Markdown'});
    console.log('Start message sent successfully');
  } catch (error) {
    console.error('Error sending start message:', error);
  }
}

// 处理 /new 命令
async function handleNew(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    await clearConversationHistory(userId);  // 清除当前对话历史
    await bot.sendMessage(chatId, `New conversation started with model ${currentModel}. Previous context has been cleared.`, {parse_mode: 'Markdown'});
    console.log('New conversation message sent successfully');
  } catch (error) {
    console.error('Error handling new conversation:', error);
  }
}

// 处理 /history 命令
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

// 处理 /help 命令
async function handleHelp(msg) {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, '等待补充', {parse_mode: 'Markdown'});
  } catch (error) {
    console.error('Error sending help message:', error);
  }
}

// 处理 /switchmodel 命令
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
    currentModel = modelName;  // 切换模型
    await clearConversationHistory(userId);  // 切换模型后清除对话记录
    await bot.sendMessage(chatId, `Model switched to: ${modelName}. Previous conversation has been cleared.`, {parse_mode: 'Markdown'});
  } else {
    await bot.sendMessage(chatId, `Invalid model name. Use /help to see available models.`, {parse_mode: 'Markdown'});
  }
}

// 处理 /img 命令
async function handleImageCommand(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const args = msg.text.split(' ');

  if (args.length < 2) {
    await bot.sendMessage(chatId, 'Please provide a prompt for image generation.', { parse_mode: 'Markdown' });
    return;
  }

  const prompt = args.slice(1, -1).join(' ');
  const size = args[args.length - 1].match(/^\d+x\d+$/) ? args[args.length - 1] : '1024x1024';  // 默认大小

  const supportedSizes = ['256x256', '512x512', '1024x1024'];

  if (!supportedSizes.includes(size)) {
    await bot.sendMessage(chatId, `Unsupported image size. Available sizes: ${supportedSizes.join(', ')}`, { parse_mode: 'Markdown' });
    return;
  }

  try {
    await bot.sendChatAction(chatId, 'upload_photo');  // 发送图片前显示上传状态
    const imageUrl = await generateImage(prompt, size);
    await bot.sendPhoto(chatId, imageUrl, { caption: `Generated image: ${prompt} (${size})` });
  } catch (error) {
    console.error('Error generating image:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error generating the image. Please try again later.', { parse_mode: 'Markdown' });
  }
}

// 处理普通消息
async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    if (!WHITELISTED_USERS.includes(userId)) {
      await bot.sendMessage(chatId, 'Sorry, you are not authorized to use this bot.', { parse_mode: 'Markdown' });
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
      await handleImageCommand(msg);  // 新增 /img 命令处理
    } else if (msg.text && !msg.text.startsWith('/')) {
      await bot.sendChatAction(chatId, 'typing');
      const conversationHistory = await getConversationHistory(userId);
      const response = await generateResponse(msg.text, conversationHistory, currentModel);
      await addToConversationHistory(userId, msg.text, response);
      await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    } else {
      console.log('Received non-text or command message');
    }
  } catch (error) {
    console.error('Error in handleMessage:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error processing your message. Please try again later.', { parse_mode: 'Markdown' });
  }
}

module.exports = { bot, handleMessage, handleStart, handleImageCommand };
