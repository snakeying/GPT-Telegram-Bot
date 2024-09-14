const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY, SYSTEM_INIT_MESSAGE, SYSTEM_INIT_MESSAGE_ROLE } = require('./config');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function* generateGeminiStreamResponse(prompt, conversationHistory, model) {
  try {
    const geminiModel = genAI.getGenerativeModel({ model: model });

    const chat = geminiModel.startChat({
      history: [
        {
          role: SYSTEM_INIT_MESSAGE_ROLE,
          parts: [{ text: SYSTEM_INIT_MESSAGE }],
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessageStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error('Error in generateGeminiStreamResponse:', error);
    throw new Error(`Failed to generate Gemini stream response: ${error.message}`);
  }
}

module.exports = { generateGeminiStreamResponse };
