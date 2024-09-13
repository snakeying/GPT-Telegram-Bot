const { OpenAI } = require('openai');
const { OPENAI_API_KEY, OPENAI_BASE_URL, DALL_E_MODEL } = require('./config');

const client = new OpenAI({ 
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL
});

const VALID_SIZES = ['1024x1024', '1792x1024', '1024x1792'];

async function generateImage(prompt, size = '1024x1024') {
  if (!VALID_SIZES.includes(size)) {
    throw new Error(`无效的图片大小。请使用以下有效尺寸之一: ${VALID_SIZES.join(', ')}`);
  }

  try {
    const response = await client.images.generate({
      model: DALL_E_MODEL,
      prompt: prompt,
      n: 1,
      size: size
    });

    return response.data[0].url;
  } catch (error) {
    console.error('生成图片时出错:', error);
    throw new Error('生成图片失败。请稍后再试。');
  }
}

module.exports = { generateImage, VALID_SIZES };
