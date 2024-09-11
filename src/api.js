const { OpenAI } = require('openai');
const { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL } = require('./config');

const client = new OpenAI({ 
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL
});

async function generateResponse(prompt) {
  console.log('Generating response for:', prompt);
  console.log('Using model:', OPENAI_MODEL);

  try {
    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Format your responses using Markdown when appropriate.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in generateResponse function:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

module.exports = { generateResponse };
