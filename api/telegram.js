const { handleMessage } = require('../src/bot');

module.exports = async (req, res) => {
  console.log('Received webhook request:', JSON.stringify(req.body));
  
  // 立即发送响应
  res.status(200).send('OK');

  // 在后台继续处理消息
  if (req.method === 'POST') {
    const update = req.body;
    console.log('Processing update:', JSON.stringify(update));
    
    if (update.message) {
      console.log('Handling message:', JSON.stringify(update.message));
      handleMessage(update.message).catch(error => {
        console.error("Error in background message handling:", error);
      });
    } else {
      console.log('Update does not contain a message');
    }
  } else {
    console.log('Received non-POST request');
  }
};
