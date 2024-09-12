const { OpenAI } = require('openai');
const { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL, DALL_E_MODEL } = require('./config');  // 引入DALL_E_MODEL

const client = new OpenAI({ 
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL
});

// 生成文本响应
async function generateResponse(prompt, conversationHistory) {
  console.log('Generating response for:', prompt);
  console.log('Using model:', OPENAI_MODEL);
  console.log('Conversation history:', JSON.stringify(conversationHistory));

  try {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant that remembers previous conversations.' },
      ...conversationHistory,
      { role: 'user', content: prompt }
    ];

    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages,
      temperature: 0.7,
    });

    console.log('Received response from OpenAI API');

    if (response.choices && response.choices.length > 0) {
      const generatedText = response.choices[0].message.content.trim();
      console.log('Generated text:', generatedText);
      return generatedText;
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error in generateResponse function:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

// 生成图片
async function generateImage(prompt, size = '1024x1024') {
  try {
    const response = await client.images.create({
      prompt: prompt,
      n: 1,
      size: size,
      model: DALL_E_MODEL || 'dall-e-3'  // 使用DALL_E_MODEL环境变量或默认DALL·E 3
    });

    if (response.data && response.data.length > 0) {
      return response.data[0].url;  // 返回图片URL
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

module.exports = { generateResponse, generateImage };
