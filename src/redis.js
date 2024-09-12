const { Redis } = require('@upstash/redis');
const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = require('./config');

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
    
    // Keep only the last 10 messages (5 exchanges)
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
    
    const jsonHistory = JSON.stringify(history);
    await redis.set(key, jsonHistory);
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

module.exports = { getConversationHistory, addToConversationHistory, clearConversationHistory };
