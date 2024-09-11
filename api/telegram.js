const { bot, handleMessage } = require('../src/bot');

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { message } = req.body;
      if (message) {
        await handleMessage(message);
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error("Error in webhook handler:", error);
    res.status(500).send('Internal Server Error');
  }
};
