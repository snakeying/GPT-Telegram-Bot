const TelegramBot = require('node-telegram-bot-api');
const { Redis } = require('@upstash/redis');
const { 
  TELEGRAM_BOT_TOKEN, 
  WHITELISTED_USERS, 
  OPENAI_MODELS, 
  GOOGLE_MODELS,
  GROQ_MODELS,
  CLAUDE_MODELS,
  AZURE_OPENAI_MODELS,
  DEFAULT_MODEL,
  OPENAI_API_KEY,
  GEMINI_API_KEY,
  GROQ_API_KEY,
  CLAUDE_API_KEY,
  AZURE_OPENAI_API_KEY,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN
} = require('./config');
const { generateResponse, generateStreamResponse } = require('./api');
const { generateGeminiResponse } = require('./geminiApi');
const { generateGroqResponse } = require('./groqapi');
const { generateClaudeResponse } = require('./claude');
const { generateAzureOpenAIResponse } = require('./azureOpenAI');
const { getConversationHistory, addToConversationHistory, clearConversationHistory } = require('./redis');
const { generateImage, VALID_SIZES } = require('./generateImage');
const { handleImageUpload } = require('./uploadHandler');

let currentModel = OPENAI_API_KEY ? DEFAULT_MODEL : null;

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
    await bot.sendMessage(chatId, `Hi~👋 你目前正在使用的模型是 ${currentModel}。请问我可以为你做些什么呢？`, {parse_mode: 'Markdown'});
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
    await bot.sendMessage(chatId, `好的,让我们重新开始吧！你现在使用的模型是 ${currentModel}。之前所有的对话记录已被清除了哦`, {parse_mode: 'Markdown'});
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
    console.log('Processed history:', JSON.stringify(history, null, 2));
    if (!Array.isArray(history) || history.length === 0) {
      await bot.sendMessage(chatId, '哎呀,没有找到任何对话历史的记录呢。', {parse_mode: 'Markdown'});
      return;
    }
    const historyText = history.map(m => `${m.role}: ${m.content}`).join('\n\n');
    await bot.sendMessage(chatId, `以下是你的对话记录:\n\n${historyText}`, {parse_mode: 'Markdown'});
  } catch (error) {
    console.error('Error retrieving conversation history:', error);
    await bot.sendMessage(chatId, 'Sorry, there was an error retrieving your conversation history.', {parse_mode: 'Markdown'});
  }
}

async function handleHelp(msg) {
  const chatId = msg.chat.id;
  try {
    const helpMessage = `
嘿，欢迎使用你的专属助手机器人！👋 这里是使用指南：

🚀 基本命令：
/start - 和我打个招呼，开始聊天吧
/new - 想要重新开始？这个命令可以清除之前的对话记录
/history - 回顾一下我们之前聊了什么
/switchmodel [模型名称] - 换个模型聊聊？
/img [描述] [尺寸] - 来，让我为你画张图！

💬 日常聊天：
直接发消息给我就行，我会用当前的 AI 模型回复你哦~

🎨 生成图片：
- 使用 /img 命令，后面跟上你想要的图片描述
- 想要特定尺寸？可以在最后加上尺寸大小（比如：1024x1024, 1792x1024, 1024x1792）
- 举个例子：/img 一只可爱的小猫咪在阳光下玩耍 1024x1024

🔍 图片分析：
- 发送一张图片给我（带不带文字描述都行）
- 我会仔细分析，然后告诉你我看到了什么

🤖 当前可用的 AI 模型：
${OPENAI_MODELS.length > 0 ? '- OpenAI：' + OPENAI_MODELS.join(', ') + '\n' : ''}${GOOGLE_MODELS.length > 0 ? '- Google：' + GOOGLE_MODELS.join(', ') + '\n' : ''}${GROQ_MODELS.length > 0 ? '- Groq：' + GROQ_MODELS.join(', ') + '\n' : ''}${CLAUDE_MODELS.length > 0 ? '- Claude：' + CLAUDE_MODELS.join(', ') + '\n' : ''}${AZURE_OPENAI_MODELS.length > 0 ? '- Azure OpenAI：' + AZURE_OPENAI_MODELS.join(', ') + '\n' : ''}
😎 目前正在使用的模型：${currentModel}

有什么问题或建议？随时告诉我的管理员~

来吧，让我们开始有趣的对话吧！✨
    `;

    await bot.sendMessage(chatId, helpMessage, {parse_mode: 'Markdown'});
    console.log('Help message sent successfully');
  } catch (error) {
    console.error('Error sending help message:', error);
  }
}

async function handleSwitchModel(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const args = msg.text.split(' ');
  
  if (args.length < 2) {
    await bot.sendMessage(chatId, '请提供一个要切换的模型名称。', {parse_mode: 'Markdown'});
    return;
  }

  const modelName = args[1].trim();
  
  if ((OPENAI_MODELS.includes(modelName) && OPENAI_API_KEY) || 
      (GOOGLE_MODELS.includes(modelName) && GEMINI_API_KEY) ||
      (GROQ_MODELS.includes(modelName) && GROQ_API_KEY) ||
      (CLAUDE_MODELS.includes(modelName) && CLAUDE_API_KEY) ||
      (AZURE_OPENAI_MODELS.includes(modelName) && AZURE_OPENAI_API_KEY)) {
    currentModel = modelName;
    await clearConversationHistory(userId);
    await bot.sendMessage(chatId, `模型已切换到: ${modelName}。之前的对话记录已经清除了哦。`, {parse_mode: 'Markdown'});
  } else {
    const availableModels = [
      ...(OPENAI_API_KEY ? OPENAI_MODELS : []),
      ...(GEMINI_API_KEY ? GOOGLE_MODELS : []),
      ...(GROQ_API_KEY ? GROQ_MODELS : []),
      ...(CLAUDE_API_KEY ? CLAUDE_MODELS : []),
      ...(AZURE_OPENAI_API_KEY ? AZURE_OPENAI_MODELS : [])
    ];
    await bot.sendMessage(chatId, `哎呀,模型名称无效或者API密钥未设置。可用的模型有: ${availableModels.join(', ')}`, {parse_mode: 'Markdown'});
  }
}

async function handleImageGeneration(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!OPENAI_API_KEY) {
    await bot.sendMessage(chatId, '抱歉,因为你没有设置OpenAI API密钥,无法生成图片。');
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
      await redis.set(requestId, imageUrl, { ex: 86400 }); // 1天后过期
      
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

  if (GROQ_MODELS.includes(currentModel) && GROQ_API_KEY) {
    try {
      const response = await generateGroqResponse(msg.text, conversationHistory, currentModel);
      await bot.sendMessage(chatId, response, {parse_mode: 'Markdown'});
      await addToConversationHistory(userId, msg.text, response);
    } catch (error) {
      console.error('Error in Groq processing:', error);
      await bot.sendMessage(chatId, '抱歉,生成回复时出现了错误。请稍后再试。', {parse_mode: 'Markdown'});
    }
    return;
  }

  if (GOOGLE_MODELS.includes(currentModel) && GEMINI_API_KEY) {
    try {
      const response = await generateGeminiResponse(msg.text, conversationHistory, currentModel);
      await bot.sendMessage(chatId, response, {parse_mode: 'Markdown'});
      await addToConversationHistory(userId, msg.text, response);
    } catch (error) {
      console.error('Error in Gemini processing:', error);
      await bot.sendMessage(chatId, '抱歉,生成回复时出现了错误。请稍后再试。', {parse_mode: 'Markdown'});
    }
    return;
  }

  let stream;
  if (OPENAI_API_KEY && OPENAI_MODELS.includes(currentModel)) {
    stream = generateStreamResponse(msg.text, conversationHistory, currentModel);
  } else if (CLAUDE_API_KEY && CLAUDE_MODELS.includes(currentModel)) {
    stream = generateClaudeResponse(msg.text, conversationHistory, currentModel);
  } else if (AZURE_OPENAI_API_KEY && AZURE_OPENAI_MODELS.includes(currentModel)) {
    stream = generateAzureOpenAIResponse(msg.text, conversationHistory, currentModel);
  } else {
    await bot.sendMessage(chatId, '抱歉,当前模型没有可用的API密钥。');
    return;
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
    await bot.sendMessage(chatId, '抱歉,生成回复时出现了错误。请稍后再试。', {parse_mode: 'Markdown'});
  }
}

async function handleImageAnalysis(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
  
    if (!OPENAI_API_KEY) {
      await bot.sendMessage(chatId, '抱歉,你没有设置OpenAI API密钥,无法进行图片分析。');
      return;
    }
  
    // Check if a photo is attached
    const photo = msg.photo && msg.photo[msg.photo.length - 1];
    if (!photo) {
      await bot.sendMessage(chatId, '请附上一张要分析的图片。');
      return;
    }
  
    // Get the prompt from the caption or wait for it
    let prompt = msg.caption;
    if (!prompt) {
      await bot.sendMessage(chatId, '请为图片分析提供一个描述或问题。');
      // Wait for the next message to be the prompt
      const promptMsg = await new Promise(resolve => bot.once('message', resolve));
      prompt = promptMsg.text;
    }
  
    await bot.sendMessage(chatId, '正在分析你的图片,请稍等片刻...');
  
    try {
      const fileInfo = await bot.getFile(photo.file_id);
      const result = await handleImageUpload(fileInfo, prompt, currentModel);
      await bot.sendMessage(chatId, result, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error in image analysis:', error);
      await bot.sendMessage(chatId, `An error occurred while analyzing the image: ${error.message}`);
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
      await bot.sendMessage(chatId, '抱歉,我只能处理文字消息和图片，请检查你的文件。', {parse_mode: 'Markdown'});
    }
  } catch (error) {
    console.error('Error in handleMessage:', error);
    await bot.sendMessage(chatId, 
      '哎呀，看来出了点小问题 😅\n\n' +
      '处理你的消息时遇到了意外情况。\n' +
      '不用担心，这种事情偶尔会发生。\n\n' +
      '💡 建议：\n' +
      '1. 稍后再试一次\n' +
      '2. 使用 /help 命令查看使用指南，也许能找到解决方法\n' +
      '3. 如果问题持续存在，请联系管理员\n\n' +
      '感谢你的理解和耐心！', 
      {parse_mode: 'Markdown'}
    );
  }
}

module.exports = { bot, handleMessage, handleStart, getMessageFromUpdate };
