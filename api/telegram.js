const bot = require('../src/bot');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    await bot.processUpdate(req.body);
    res.status(200).send('OK');
  } else {
    res.status(200).send('Telegram Bot is running!');
  }
};
