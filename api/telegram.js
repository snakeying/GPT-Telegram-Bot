const bot = require('../src/bot');

module.exports = async (req, res) => {
  console.log('Received webhook request:', req.method, JSON.stringify(req.body));
  if (req.method === 'POST') {
    try {
      await bot.processUpdate(req.body);
      console.log('Successfully processed update');
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing update:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    console.log('Received non-POST request');
    res.status(200).send('Telegram Bot is running!');
  }
};
