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
    const fullUrl = `${OPENAI_BASE_URL}/chat/completions`;
    console.log('Full API URL:', fullUrl);
    
    const requestBody = {
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    };
    console.log('Request body:', JSON.stringify(requestBody));

    const response = await openaiApi.post('/chat/completions', requestBody);

    console.log('OpenAI API response status:', response.status);
    console.log('OpenAI API response headers:', JSON.stringify(response.headers));
    console.log('OpenAI API response data:', JSON.stringify(response.data));

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    if (error.response) {
      console.error('API response status:', error.response.status);
      console.error('API response headers:', JSON.stringify(error.response.headers));
      console.error('API response data:', JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw new Error('Failed to generate response from OpenAI');
  }
}

module.exports = { generateResponse };
