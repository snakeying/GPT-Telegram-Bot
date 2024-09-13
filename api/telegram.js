const { bot, handleMessage, handleStart } = require('../src/bot');

module.exports = async (req, res) => {
  console.log('Received webhook request:', JSON.stringify(req.body));
  try {
    if (req.method === 'POST') {
      const update = req.body;
      console.log('Processing update:', JSON.stringify(update));
      
      if (update.message) {
        console.log('Handling message:', JSON.stringify(update.message));
        await handleMessage(update.message);
        console.log('Message handled successfully');
      } else {
        console.log('Update does not contain a message');
      }
    } else {
      console.log('Received non-POST request');
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error("Error in webhook handler:", error);
    // 即使出错，也发送 200 状态码，以防止 Telegram 重复发送请求
    res.status(200).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: error.stack
    });
  }
};
