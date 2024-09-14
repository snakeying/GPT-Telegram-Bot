const fs = require('fs');
const path = require('path');
const fileType = require('file-type');
const axios = require('axios');
const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { OPENAI_API_KEY, OPENAI_BASE_URL, SYSTEM_INIT_MESSAGE, SYSTEM_INIT_MESSAGE_ROLE } = require('./config');

const client = new OpenAI({ 
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4'];

async function handleFileUpload(fileInfo, prompt, model) {
  if (fileInfo.file_size > MAX_FILE_SIZE) {
    return 'File size exceeds the 10MB limit.';
  }

  if (!SUPPORTED_MODELS.includes(model)) {
    return `Unsupported model. This feature only supports: ${SUPPORTED_MODELS.join(', ')}`;
  }

  const filePath = `/tmp/${fileInfo.file_id}`;
  await downloadFile(fileInfo.file_path, filePath);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const detectedType = await fileType.fromBuffer(fileBuffer);

    let content;
    let mimeType;

    if (detectedType) {
      if (detectedType.mime.startsWith('image/')) {
        content = fileBuffer.toString('base64');
        mimeType = detectedType.mime;
      } else if (detectedType.ext === 'pdf') {
        const pdfData = await pdfParse(fileBuffer);
        content = pdfData.text;
        mimeType = 'text/plain';
      } else if (detectedType.ext === 'docx') {
        const result = await mammoth.extractRawText({buffer: fileBuffer});
        content = result.value;
        mimeType = 'text/plain';
      } else {
        return 'Unsupported file type.';
      }
    } else {
      // Assume it's a text file if type is not detected
      content = fileBuffer.toString('utf8');
      mimeType = 'text/plain';
    }

    fs.unlinkSync(filePath);

    const response = await analyzeContent(content, mimeType, prompt, model);
    return response;
  } catch (error) {
    console.error('Error in file processing:', error);
    return `File processing error: ${error.message}`;
  }
}

async function downloadFile(filePath, destPath) {
  const response = await axios({
    method: 'GET',
    url: `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`,
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(destPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function analyzeContent(content, mimeType, prompt, model) {
  try {
    let messages;
    if (mimeType.startsWith('image/')) {
      messages = [
        { role: SYSTEM_INIT_MESSAGE_ROLE, content: SYSTEM_INIT_MESSAGE },
        { 
          role: "user", 
          content: [
            { type: "text", text: prompt },
            { 
              type: "image_url", 
              image_url: {
                url: `data:${mimeType};base64,${content}`
              }
            }
          ] 
        }
      ];
    } else {
      messages = [
        { role: SYSTEM_INIT_MESSAGE_ROLE, content: SYSTEM_INIT_MESSAGE },
        { role: "user", content: `${prompt}\n\nFile content: ${content}` }
      ];
    }

    const response = await client.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    return 'An error occurred while analyzing the file.';
  }
}

module.exports = { handleFileUpload };
