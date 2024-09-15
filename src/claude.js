const axios = require('axios');
const { CLAUDE_API_KEY, CLAUDE_ENDPOINT, SYSTEM_INIT_MESSAGE, SYSTEM_INIT_MESSAGE_ROLE } = require('./config');

async function generateClaudeResponse(prompt, conversationHistory, model) {
  try {
    const response = await axios.post(
      CLAUDE_ENDPOINT,
      {
        model: model,
        messages: [
          { role: SYSTEM_INIT_MESSAGE_ROLE, content: SYSTEM_INIT_MESSAGE },
          ...conversationHistory,
          { role: 'user', content: prompt }
        ],
        stream: true
      },
      {
        headers: {
          'Authorization': `Bearer ${CLAUDE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in generateClaudeResponse:', error);
    throw new Error(`Failed to generate Claude response: ${error.message}`);
  }
}

module.exports = { generateClaudeResponse };
