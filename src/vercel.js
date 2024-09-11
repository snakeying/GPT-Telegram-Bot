const bot = require('./bot');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    bot.processUpdate(req.body);
    res.status(200).send('OK');
  } else {
    res.status(200).send('Telegram Bot is running!');
  }
};
