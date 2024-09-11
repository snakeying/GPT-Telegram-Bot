const { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL } = require('./config');

async function generateResponse(prompt) {
  const fullUrl = `${OPENAI_BASE_URL}/chat/completions`;
  console.log('Full API URL:', fullUrl);

  const requestBody = {
    model: OPENAI_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  };
  console.log('Request body:', JSON.stringify(requestBody));

  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  try {
    console.log('Sending request to OpenAI API...');
    const fetchPromise = fetch(fullUrl, requestOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), 50000)
    );

    const response = await Promise.race([fetchPromise, timeoutPromise]);
    console.log('Received response from OpenAI API');
    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers)));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', JSON.stringify(data));

    if (data.choices && data.choices.length > 0) {
      const generatedText = data.choices[0].message.content.trim();
      console.log('Generated text:', generatedText);
      return generatedText;
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error in generateResponse function:', error);
    throw new Error(`Failed to generate response from OpenAI: ${error.message}`);
  }
}

module.exports = { generateResponse };
