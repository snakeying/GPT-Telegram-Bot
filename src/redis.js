const { Redis } = require('@upstash/redis');
const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = require('./config');

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

async function getConversationHistory(userId) {
  try {
    const history = await redis.get(`user:${userId}:history`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting conversation history:', error);
    return [];
  }
}

async function addToConversationHistory(userId, message, response) {
  try {
    const history = await getConversationHistory(userId);
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: response });
    
    // Keep only the last 10 messages (5 exchanges)
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
    
    await redis.set(`user:${userId}:history`, JSON.stringify(history));
  } catch (error) {
    console.error('Error adding to conversation history:', error);
  }
}

module.exports = { getConversationHistory, addToConversationHistory };
