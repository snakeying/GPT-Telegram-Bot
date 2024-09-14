const fs = require('fs');
const path = require('path');
const fileType = require('file-type');
const axios = require('axios');
const { OpenAI } = require('openai');
const { OPENAI_API_KEY, OPENAI_BASE_URL, SYSTEM_INIT_MESSAGE, SYSTEM_INIT_MESSAGE_ROLE } = require('./config');

const client = new OpenAI({ 
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL
});

const SUPPORTED_EXTENSIONS = ['pdf', 'txt', 'docx', 'jpg', 'jpeg', 'png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4'];

const extensionToMimeMap = {
  pdf: 'application/pdf',
  txt: 'text/plain',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png'
};

async function handleFileUpload(fileInfo, prompt, model) {
  // Check file size
  if (fileInfo.file_size > MAX_FILE_SIZE) {
    return 'File size exceeds the 10MB limit.';
  }

  // Check if the model is supported
  if (!SUPPORTED_MODELS.includes(model)) {
    return `Unsupported model. This feature only supports: ${SUPPORTED_MODELS.join(', ')}`;
  }

  // Download file
  const filePath = `/tmp/${fileInfo.file_id}`;
  await downloadFile(fileInfo.file_path, filePath);

  try {
    // Verify file type
    const fileBuffer = fs.readFileSync(filePath);
    const detectedType = await fileType.fromBuffer(fileBuffer);

    if (!detectedType || !SUPPORTED_EXTENSIONS.includes(detectedType.ext)) {
      fs.unlinkSync(filePath);
      return 'Invalid file type. The file content is not supported.';
    }

    // Process file based on type
    let content;
    if (['jpg', 'jpeg', 'png'].includes(detectedType.ext)) {
      content = fileBuffer.toString('base64');
    } else {
      content = fileBuffer.toString('utf8');
    }

    // Delete temporary file
    fs.unlinkSync(filePath);

    // Send to OpenAI for analysis
    const response = await analyzeContent(content, prompt, model);

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

async function analyzeContent(content, prompt, model) {
  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: SYSTEM_INIT_MESSAGE_ROLE, content: SYSTEM_INIT_MESSAGE },
        { role: "user", content: `${prompt}\n\nFile content: ${content}` }
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    return 'An error occurred while analyzing the file.';
  }
}

module.exports = { handleFileUpload };
