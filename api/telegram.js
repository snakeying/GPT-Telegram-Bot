const bot = require('../src/bot');

module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error("Error in webhook handler:", error);
    res.status(500).send('Internal Server Error');
  }
};
