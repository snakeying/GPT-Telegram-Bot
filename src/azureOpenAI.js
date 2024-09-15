const axios = require('axios');
const { 
  AZURE_OPENAI_API_KEY, 
  AZURE_OPENAI_ENDPOINT, 
  SYSTEM_INIT_MESSAGE, 
  SYSTEM_INIT_MESSAGE_ROLE 
} = require('./config');

async function generateAzureOpenAIResponse(prompt, conversationHistory, model) {
  try {
    const response = await axios.post(
      `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${model}/chat/completions?api-version=2023-06-01`,
      {
        messages: [
          { role: SYSTEM_INIT_MESSAGE_ROLE, content: SYSTEM_INIT_MESSAGE },
          ...conversationHistory,
          { role: 'user', content: prompt }
        ],
        stream: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_OPENAI_API_KEY
        },
        responseType: 'stream'
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in generateAzureOpenAIResponse:', error);
    throw new Error(`Failed to generate Azure OpenAI response: ${error.message}`);
  }
}

module.exports = { generateAzureOpenAIResponse };
