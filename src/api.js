const axios = require('axios');
const { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL } = require('./config');

const openaiApi = axios.create({
  baseURL: OPENAI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

async function generateResponse(prompt) {
  try {
    console.log('Calling OpenAI API with prompt:', prompt);
    console.log('Using model:', OPENAI_MODEL);
    const response = await openaiApi.post('/chat/completions', {
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    console.log('OpenAI API response:', JSON.stringify(response.data));
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate response from OpenAI');
  }
}

module.exports = { generateResponse };
