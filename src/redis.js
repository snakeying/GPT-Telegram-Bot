const { Redis } = require('@upstash/redis');
const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, MAX_HISTORY_LENGTH } = require('./config');
const { generateResponse } = require('./api');
const { generateGeminiResponse } = require('./geminiApi');
const { generateGroqResponse } = require('./groqapi');
const { generateClaudeResponse } = require('./claude');
const { generateAzureOpenAIResponse } = require('./azureOpenAI');
const { OPENAI_MODELS, GOOGLE_MODELS, GROQ_MODELS, CLAUDE_MODELS, AZURE_OPENAI_MODELS } = require('./config');

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

async function getConversationHistory(userId) {
  try {
    const key = `user:${userId}:history`;
    const history = await redis.get(key);
    console.log(`Retrieved raw history for user ${userId}:`, history);
    
    if (typeof history === 'string') {
      return JSON.parse(history);
    } else if (Array.isArray(history)) {
      return history;
    } else if (history && typeof history === 'object') {
      return [history];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error getting conversation history:', error);
    return [];
  }
}

async function addToConversationHistory(userId, message, response) {
  try {
    const key = `user:${userId}:history`;
    const history = await getConversationHistory(userId);
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: response });
    
    // Keep only the last MAX_HISTORY_LENGTH messages
    if (history.length > MAX_HISTORY_LENGTH) {
      history.splice(0, history.length - MAX_HISTORY_LENGTH);
    }
    
    const jsonHistory = JSON.stringify(history);
    await redis.set(key, jsonHistory, { ex: 2592000 }); // 30 days TTL
    console.log(`Updated history for user ${userId}:`, jsonHistory);
  } catch (error) {
    console.error('Error adding to conversation history:', error);
  }
}

async function clearConversationHistory(userId) {
  try {
    const key = `user:${userId}:history`;
    await redis.del(key);
    console.log(`Cleared history for user ${userId}`);
  } catch (error) {
    console.error('Error clearing conversation history:', error);
  }
}

async function getSummarizedConversationHistory(userId, currentModel) {
  try {
    const history = await getConversationHistory(userId);
    if (history.length === 0) {
      return null;
    }
    
    // Prepare the prompt for summarization
    const historyText = history.map(m => `${m.role}: ${m.content}`).join('\n\n');
    const summarizationPrompt = `Please summarize the following conversation history concisely:\n\n${historyText}\n\nSummary:`;
    
    // Generate summary using the current model
    let summary;
    if (OPENAI_MODELS.includes(currentModel)) {
      summary = await generateResponse(summarizationPrompt, [], currentModel);
    } else if (GOOGLE_MODELS.includes(currentModel)) {
      summary = await generateGeminiResponse(summarizationPrompt, [], currentModel);
    } else if (GROQ_MODELS.includes(currentModel)) {
      summary = await generateGroqResponse(summarizationPrompt, [], currentModel);
    } else if (CLAUDE_MODELS.includes(currentModel)) {
      summary = await generateClaudeResponse(summarizationPrompt, [], currentModel);
    } else if (AZURE_OPENAI_MODELS.includes(currentModel)) {
      summary = await generateAzureOpenAIResponse(summarizationPrompt, [], currentModel);
    } else {
      throw new Error('Unsupported model for summarization');
    }
    
    return summary.trim();
  } catch (error) {
    console.error('Error summarizing conversation history:', error);
    return null;
  }
}

module.exports = { 
  getConversationHistory, 
  addToConversationHistory, 
  clearConversationHistory,
  getSummarizedConversationHistory
};
