const { DALL_E_MODEL } = require('../src/config'); 
const { OpenAI } = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SUPPORTED_RESOLUTIONS = ['256x256', '512x512', '1024x1024'];  // DALL·E 3 支持的分辨率

async function generateImage(prompt, resolution = '1024x1024') {
  if (!SUPPORTED_RESOLUTIONS.includes(resolution)) {
    throw new Error(`Unsupported resolution. Please use one of the following: ${SUPPORTED_RESOLUTIONS.join(', ')}`);
  }

  try {
    const response = await client.images.generate({
      model: DALL_E_MODEL || 'dall-e-3',  // 默认使用 DALL·E 3
      prompt,
      n: 1,
      size: resolution,
    });

    const imageUrl = response.data[0].url;  // 获取图片的URL
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

module.exports = { generateImage };
