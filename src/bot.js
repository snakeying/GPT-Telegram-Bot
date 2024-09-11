const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN, WHITELISTED_USERS, OPENAI_MODELS } = require('./config');
const { generateResponse } = require('./api');
const { getConversationHistory, addToConversationHistory, clearConversationHistory } = require('./redis');
const { Redis } = require('@upstash/redis');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function handleStart(msg) {
  console.log('Handling /start command');
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, 'Welcome! Send me a message and I\'ll generate a response using AI.', {parse_mode: 'Markdown'});
    console.log('Start message sent successfully');
  } catch (error) {
    console.error('Error sending start message:', error);
    throw error;
  }
}

async function handleNew(msg) {
  console.log('Handling /new command');
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    await clearConversationHistory(userId);
    await bot.sendMessage(chatId, 'New conversation started. Previous context has been cleared.', {parse_mode: 'Markdown'});
    console.log('New conversation message sent successfully');
  } catch (error) {
    console.error('Error handling new conversation:', error);
    throw error;
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
  const helpMessage = "等待补充";
  await bot.sendMessage(chatId, helpMessage, {parse_mode: 'Markdown'});
}

async function handleSwitchModel(msg, model) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!model) {
    await bot.sendMessage(chatId, "请提供一个模型名称。使用方法：/switchmodel [model_name]", {parse_mode: 'Markdown'});
    return;
  }

  if (OPENAI_MODELS.includes(model)) {
    await redis.set(`user:${userId}:model`, model);
    await bot.sendMessage(chatId, `模型已切换到 ${model}`, {parse_mode: 'Markdown'});
  } else {
    await bot.sendMessage(chatId, `无效的模型名称。请使用 /help 查看可用模型。`, {parse_mode: 'Markdown'});
  }
}

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

    if (msg.text === '/new') {
      await handleNew(msg);
    } else if (msg.text === '/history') {
      await handleHistory(msg);
    } else if (msg.text === '/help') {
      await handleHelp(msg);
    } else if (msg.text.startsWith('/switchmodel')) {
      const model = msg.text.split(' ')[1];
      await handleSwitchModel(msg, model);
    } else if (msg.text && !msg.text.startsWith('/')) {
      console.log('Generating response for:', msg.text);
      
      // Send "typing" action
      await bot.sendChatAction(chatId, 'typing');
      
      // Get conversation history
      const conversationHistory = await getConversationHistory(userId);
      console.log('Retrieved conversation history:', JSON.stringify(conversationHistory));
      
      // Get user's current model or use the first model in OPENAI_MODELS
      const userModel = await redis.get(`user:${userId}:model`) || OPENAI_MODELS[0];
      
      const response = await generateResponse(msg.text, conversationHistory, userModel);
      console.log('Generated response:', response);
      
      // Add to conversation history
      await addToConversationHistory(userId, msg.text, response);
      
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

module.exports = { bot, handleMessage, handleStart };
