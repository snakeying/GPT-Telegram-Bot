const { OpenAI } = require('openai');
const { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL } = require('./config');

const client = new OpenAI({ 
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL
});

async function* generateResponseStream(prompt) {
  console.log('Generating response for:', prompt);
  console.log('Using model:', OPENAI_MODEL);

  try {
    const stream = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: true,
    });

    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Error in generateResponseStream function:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

module.exports = { generateResponseStream };
