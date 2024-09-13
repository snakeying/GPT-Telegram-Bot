const { bot, handleMessage, handleStart } = require('../src/bot');

const processedUpdates = new Set();

module.exports = async (req, res) => {
  console.log('Received webhook request:', JSON.stringify(req.body));
  try {
    if (req.method === 'POST') {
      const update = req.body;
      console.log('Processing update:', JSON.stringify(update));
      
      if (update.update_id && !processedUpdates.has(update.update_id)) {
        processedUpdates.add(update.update_id);
        
        if (update.message) {
          console.log('Handling message:', JSON.stringify(update.message));
          await handleMessage(update.message);
          console.log('Message handled successfully');
        } else {
          console.log('Update does not contain a message');
        }
        
        // 清理旧的更新ID，以防止内存泄漏
        if (processedUpdates.size > 1000) {
          const oldestUpdateId = Math.min(...processedUpdates);
          processedUpdates.delete(oldestUpdateId);
        }
      } else {
        console.log('Duplicate update or missing update_id, skipping');
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
