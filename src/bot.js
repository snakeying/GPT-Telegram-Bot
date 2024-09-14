const TelegramBot = require('node-telegram-bot-api');
const { Redis } = require('@upstash/redis');
const { 
  TELEGRAM_BOT_TOKEN, 
  WHITELISTED_USERS, 
  OPENAI_MODELS, 
  GOOGLE_MODELS, 
  DEFAULT_MODEL,
  OPENAI_API_KEY,
  GEMINI_API_KEY,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN
} = require('./config');
const { generateStreamResponse } = require('./api');
const { generateGeminiStreamResponse } = require('./geminiApi');
const { getConversationHistory, addToConversationHistory, clearConversationHistory } = require('./redis');
const { generateImage, VALID_SIZES } = require('./generateImage');
const { handleImageUpload } = require('./uploadHandler');

let currentModel = DEFAULT_MODEL;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  cancellation: true
});

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

function getMessageFromUpdate(update) {
  return update.message || update.edited_message;
}

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
  
  if (OPENAI_MODELS.includes(modelName) || GOOGLE_MODELS.includes(modelName)) {
    currentModel = modelName;
    await clearConversationHistory(userId);
    await bot.sendMessage(chatId, `Model switched to: ${modelName}. Previous conversation has been cleared.`, {parse_mode: 'Markdown'});
  } else {
    const allModels = [...OPENAI_MODELS, ...GOOGLE_MODELS];
    await bot.sendMessage(chatId, `Invalid model name. Available models are: ${allModels.join(', ')}`, {parse_mode: 'Markdown'});
  }
}

async function handleImageGeneration(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!OPENAI_API_KEY) {
    await bot.sendMessage(chatId, 'Sorry, image generation is not available without OpenAI API key.');
    return;
  }

  const args = msg.text.split(' ');
  args.shift(); // 移除 "/img" 命令

  let size = '1024x1024';
  let prompt;

  // 检查最后一个参数是否可能是尺寸
  const possibleSize = args[args.length - 1];
  if (possibleSize.includes('x')) {
    const [width, height] = possibleSize.split('x').map(Number);
    if (VALID_SIZES.includes(`${width}x${height}`)) {
      size = `${width}x${height}`;
      args.pop(); // 从参数列表中移除尺寸
    } else {
      // 如果尺寸无效，发送错误消息并返回
      await bot.sendMessage(chatId, `无效的图片大小: ${possibleSize}。请使用以下有效尺寸之一: ${VALID_SIZES.join(', ')}`);
      return;
    }
  }

  prompt = args.join(' ');

  if (prompt.trim() === '') {
    await bot.sendMessage(chatId, '请提供图片描述。');
    return;
  }

  try {
    console.log(`开始处理图片生成请求. 聊天ID: ${chatId}, 提示: "${prompt}", 尺寸: ${size}`);
    await bot.sendChatAction(chatId, 'upload_photo');
    
    const requestId = `img_req:${userId}:${Date.now()}`;
    
    const existingImageUrl = await redis.get(requestId);
    
    if (existingImageUrl) {
      console.log(`使用已生成的图片 URL: ${existingImageUrl}`);
      await bot.sendPhoto(chatId, existingImageUrl, { caption: prompt });
      return;
    }
    
    console.log(`Generating image with prompt: "${prompt}" and size: ${size}`);
    const imageUrl = await generateImage(prompt, size);
    console.log(`Image URL generated: ${imageUrl}`);
    
    if (imageUrl) {
      await redis.set(requestId, imageUrl, { ex: 3600 }); // 1小时过期
      
      console.log(`开始发送图片. URL: ${imageUrl}`);
      await bot.sendPhoto(chatId, imageUrl, { caption: prompt });
      console.log('Photo sent successfully');
    } else {
      throw new Error('未能获取图片URL');
    }
  } catch (error) {
    console.error('图片生成或发送错误:', error);
    let errorMessage = '生成或发送图片时出错。';
    if (error.response) {
      console.error('API 错误响应:', error.response.data);
      errorMessage += ` API 错误: ${error.response.data.error.message}`;
    } else if (error.request) {
      console.error('没有收到 API 响应');
      errorMessage += ' 未收到 API 响应。';
    } else {
      errorMessage += ` ${error.message}`;
    }
    await bot.sendMessage(chatId, errorMessage);
  }
}

async function handleStreamMessage(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  await bot.sendChatAction(chatId, 'typing');
  const conversationHistory = await getConversationHistory(userId);

  let stream;
  if (GOOGLE_MODELS.includes(currentModel)) {
    if (!GEMINI_API_KEY) {
      await bot.sendMessage(chatId, 'Sorry, Gemini models are not available without Gemini API key.');
      return;
    }
    stream = generateGeminiStreamResponse(msg.text, conversationHistory, currentModel);
  } else {
    if (!OPENAI_API_KEY) {
      await bot.sendMessage(chatId, 'Sorry, OpenAI models are not available without OpenAI API key.');
      return;
    }
    stream = await generateStreamResponse(msg.text, conversationHistory, currentModel);
  }

  let fullResponse = '';
  let messageSent = false;
  let messageId;

  try {
    for await (const chunk of stream) {
      fullResponse += chunk;

      if (fullResponse.length > 0 && !messageSent) {
        const sentMsg = await bot.sendMessage(chatId, fullResponse, {parse_mode: 'Markdown'});
        messageId = sentMsg.message_id;
        messageSent = true;
      } else if (messageSent && fullResponse.length % 20 === 0) {
        try {
          await bot.editMessageText(fullResponse, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown'
          });
        } catch (error) {
          console.error('Error editing message:', error);
          // 如果编辑失败，可能是由于 Markdown 解析错误，尝试不使用 Markdown 发送
          await bot.editMessageText(fullResponse, {
            chat_id: chatId,
            message_id: messageId
          });
        }
      }
    }

    if (messageSent) {
      await bot.editMessageText(fullResponse, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      });
    }

    await addToConversationHistory(userId, msg.text, fullResponse);
  } catch (error) {
    console.error('Error in stream processing:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error generating the response. Please try again later.', {parse_mode: 'Markdown'});
  }
}

async function handleImageAnalysis(msg) {
  const chatId = msg.chat.id;
  
  if (!OPENAI_API_KEY) {
    await bot.sendMessage(chatId, 'Sorry, image analysis is not available without OpenAI API key.');
    return;
  }

  // Check if a photo is attached
  const photo = msg.photo && msg.photo[msg.photo.length - 1];
  if (!photo) {
    await bot.sendMessage(chatId, 'Please attach a photo to analyze.');
    return;
  }

  // Get the prompt from the caption or wait for it
  let prompt = msg.caption;
  if (!prompt) {
    await bot.sendMessage(chatId, 'Please provide a prompt for image analysis.');
    // Wait for the next message to be the prompt
    const promptMsg = await new Promise(resolve => bot.once('message', resolve));
    prompt = promptMsg.text;
  }

  await bot.sendMessage(chatId, 'Analyzing your image. This may take a moment...');

  try {
    const fileInfo = await bot.getFile(photo.file_id);
    const result = await handleImageUpload(fileInfo, prompt, currentModel);
    await bot.sendMessage(chatId, result, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in image analysis:', error);
    await bot.sendMessage(chatId, 'An error occurred while analyzing the image. Please try again.');
  }
}

async function handleMessage(update) {
  const msg = getMessageFromUpdate(update);
  if (!msg) {
    console.log('Update does not contain a valid message');
    return;
  }

  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    if (!WHITELISTED_USERS.includes(userId)) {
      await bot.sendMessage(chatId, 'Sorry, you are not authorized to use this bot.', {parse_mode: 'Markdown'});
      return;
    }

    if (msg.photo) {
      await handleImageAnalysis(msg);
    } else if (msg.text) {
      if (msg.text === '/start') {
        await handleStart(msg);
      } else if (msg.text === '/new') {
        await handleNew(msg);
      } else if (msg.text === '/history') {
        await handleHistory(msg);
      } else if (msg.text === '/help') {
        await handleHelp(msg);
      } else if (msg.text.startsWith('/switchmodel')) {
        await handleSwitchModel(msg);
      } else if (msg.text.startsWith('/img')) {
        await handleImageGeneration(msg);
      } else {
        await handleStreamMessage(msg);
      }
    } else {
      console.log('Received unsupported message type');
      await bot.sendMessage(chatId, 'Sorry, I can only process text messages and photos.', {parse_mode: 'Markdown'});
    }
  } catch (error) {
    console.error('Error in handleMessage:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error processing your message. Please try again later.', {parse_mode: 'Markdown'});
  }
}

module.exports = { bot, handleMessage, handleStart, getMessageFromUpdate };
