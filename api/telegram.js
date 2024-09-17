const { bot, handleMessage, handleStart, getMessageFromUpdate, updateBotCommands } = require('../src/bot');
const { Redis } = require('@upstash/redis');
const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = require('../src/config');

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  console.log('Received webhook request:', JSON.stringify(req.body));
  try {
    if (req.method === 'POST') {
      const update = req.body;
      console.log('Processing update:', JSON.stringify(update));
      
      if (update.update_id) {
        const key = `processed:${update.update_id}`;
        const isProcessed = await redis.get(key);
        
        if (!isProcessed) {
          await redis.set(key, 'true', { ex: 86400 });
          
          const message = getMessageFromUpdate(update);
          if (message) {
            console.log('Handling message:', JSON.stringify(message));
            
            // 检查是否是新用户
            const userId = message.from.id;
            const userKey = `user:${userId}`;
            const userExists = await redis.get(userKey);
            
            if (!userExists) {
              console.log(`New user detected: ${userId}`);
              await redis.set(userKey, 'true');
              await updateBotCommands(userId);
            }
            
            await handleMessage(update);
            console.log('Message handled successfully');
          } else {
            console.log('Update does not contain a valid message');
          }
        } else {
          console.log('Duplicate update, skipping');
        }
      } else {
        console.log('Missing update_id, skipping');
      }
    } else {
      console.log('Received non-POST request');
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error("Error in webhook handler:", error);
    res.status(200).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: error.stack
    });
  }
};
