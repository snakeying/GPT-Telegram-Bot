const axios = require('axios');
const { GROQ_API_KEY, SYSTEM_INIT_MESSAGE, SYSTEM_INIT_MESSAGE_ROLE } = require('./config');

async function generateGroqResponse(prompt, conversationHistory, model) {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: model,
        messages: [
          { role: SYSTEM_INIT_MESSAGE_ROLE, content: SYSTEM_INIT_MESSAGE },
          ...conversationHistory,
          { role: 'user', content: prompt }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateGroqResponse:', error);
    throw new Error(`Failed to generate Groq response: ${error.message}`);
  }
}

module.exports = { generateGroqResponse };
