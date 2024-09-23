const { Redis } = require('@upstash/redis');
const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, MAX_HISTORY_LENGTH } = require('./config');

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

async function getConversationHistory(userId, page = 1, pageSize = 10) {
  try {
    const key = `user:${userId}:history`;
    const history = await redis.get(key);
    console.log(`Retrieved raw history for user ${userId}:`, history);
    
    let parsedHistory;
    if (typeof history === 'string') {
      parsedHistory = JSON.parse(history);
    } else if (Array.isArray(history)) {
      parsedHistory = history;
    } else if (history && typeof history === 'object') {
      parsedHistory = [history];
    } else {
      parsedHistory = [];
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return parsedHistory.slice(startIndex, endIndex);
  } catch (error) {
    console.error('Error getting conversation history:', error);
    return [];
  }
}

async function getConversationHistoryPageCount(userId, pageSize = 10) {
  try {
    const key = `user:${userId}:history`;
    const history = await redis.get(key);
    let historyLength = 0;
    
    if (typeof history === 'string') {
      historyLength = JSON.parse(history).length;
    } else if (Array.isArray(history)) {
      historyLength = history.length;
    } else if (history && typeof history === 'object') {
      historyLength = 1;
    }
    
    return Math.ceil(historyLength / pageSize);
  } catch (error) {
    console.error('Error getting conversation history page count:', error);
    return 0;
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

module.exports = { 
  getConversationHistory, 
  addToConversationHistory, 
  clearConversationHistory,
  getConversationHistoryPageCount 
};
