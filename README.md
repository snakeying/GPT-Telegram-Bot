# GPT-Telegram-Bot: Multifunctional AI Assistant 🤖💬

[English](./README.md) | [简体中文](./docs/README.zh-cn.md) | [繁體中文](./docs/README.zh-hant.md) | [日本語](./docs/README.ja.md) | [Español](./docs/README.es.md) | [Français](./docs/README.fr.md) | [Русский](./docs/README.ru.md) | [Deutsch](./docs/README.de.md)

GPT-Telegram-Bot is a powerful Telegram bot that integrates various AI models, providing intelligent conversations, image generation and analysis capabilities.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnakeying%2FGPT-Telegram-Bot)

## Main Features 🌟

1. **Multi-model Support** 🎭: Any model compatible with OpenAI API, Google Gemini, Anthropic Claude, Groq, and Azure OpenAI
2. **Intelligent Conversations** 💬: Natural language interactions with context memory support
3. **Image Generation** 🎨: Create images based on text descriptions
4. **Image Analysis** 🔍: Interpret and describe uploaded images
5. **Multilingual Support** 🌐: Localization support for multiple languages
6. **Stream Response** ⚡: Real-time generation and display of AI replies
7. **User Whitelist** 🔐: Can be set to allow access only to specific users

## Supported AI Models 🧠

- OpenAI Series: Powerful language models 🚀
- Google Gemini: Google's next-generation AI model 🧑‍🔬
- Anthropic Claude: Another powerful language model choice 🎭
- Groq: High-speed inference AI model ⚡
- Azure OpenAI: Microsoft-hosted OpenAI service 👔

## Project Structure 📁

```
GPT-Telegram-Bot/
├── api/                 # API related configurations
│   └── telegram.js      # Handle Telegram bot interactions
├── src/                 # Source code
│   ├── bot.js           # Main Telegram bot logic
│   ├── api.js           # Handle API interactions
│   ├── config.js        # Configuration file
│   ├── uploadhandler.js # Handle image uploads
│   └── redis.js         # Upstash Redis database functionality
├── locales/             # Multilingual support files
├── package.json         # Project dependencies
├── vercel.json          # Vercel configuration file
└── .gitignore           # Git ignore file
```

- `api/telegram.js`: Handles webhook requests from Telegram
- `src/bot.js`: Contains main bot logic and command processing
- `src/api.js`: Manages API interactions with different AI services
- `src/config.js`: Stores project configurations and environment variables
- `src/uploadhandler.js`: Handles image upload and analysis functionality
- `src/redis.js`: Manages interactions with Upstash Redis, used for storing conversation history
- `locales/`: Contains translation files for different languages, supporting multilingual functionality

## Quick Start 🚀

### Prerequisites

- [Vercel](https://vercel.com/) account
- Telegram account and Bot Token
- [Upstash](https://upstash.com/) Please select the Redis database and enable the [Eviction](https://upstash.com/docs/redis/features/eviction) feature
- API key for at least one AI service

### Deployment Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/snakeying/GPT-Telegram-Bot.git
   cd GPT-Telegram-Bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file and fill in the necessary configuration information (refer to the environment variable configuration below).

4. Deploy to Vercel:
   - Fork this repo
   - Modify according to the instructions at the bottom of the readme
   - Click the "Deploy with Vercel" button
   - Connect your GitHub repository
   - Configure environment variables
   - Complete deployment

5. Set up Telegram Webhook:
   After deployment, use the following URL to set up the Webhook:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_VERCEL_DOMAIN>/api/telegram
   ```

## Environment Variable Configuration 🔧

Before deploying and running GPT-Telegram-Bot, you need to set the following environment variables. Create a `.env` file in the project root directory and configure the following variables:

| Variable Name | Description | Default Value |
|--------|------|--------|
| `OPENAI_API_KEY` | OpenAI API key | - |
| `OPENAI_BASE_URL` | OpenAI API base URL | https://api.openai.com/v1 |
| `OPENAI_MODELS` | OpenAI models to use (comma-separated) | - |
| `DEFAULT_MODEL` | Default model to use | First model in OPENAI_MODELS |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key | - |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint | - |
| `AZURE_OPENAI_MODELS` | Azure OpenAI models to use (comma-separated) | - |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | - |
| `WHITELISTED_USERS` | Allowed user IDs (comma-separated) | - |
| `DALL_E_MODEL` | DALL-E model to use | dall-e-3 |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | - |
| `UPSTASH_REST_TOKEN` | Upstash Redis REST Token | - |
| `SYSTEM_INIT_MESSAGE` | System initialization message | You are a helpful assistant. |
| `SYSTEM_INIT_MESSAGE_ROLE` | System message role | system |
| `GEMINI_API_KEY` | Google Gemini API key | - |
| `GOOGLE_MODELS` | Google models to use (comma-separated) | - |
| `GEMINI_ENDPOINT` | Gemini API endpoint | https://generativelanguage.googleapis.com/v1beta/models |
| `GROQ_API_KEY` | Groq API key | - |
| `GROQ_MODELS` | Groq models to use (comma-separated) | - |
| `MAX_HISTORY_LENGTH` | Maximum history length | 50 |
| `CLAUDE_API_KEY` | Anthropic Claude API key | - |
| `CLAUDE_MODELS` | Claude models to use (comma-separated) | - |
| `CLAUDE_ENDPOINT` | Claude API endpoint | https://api.anthropic.com/v1/chat/completions |

Make sure to add these environment variables to your project's environment configuration when deploying to Vercel or other platforms.

## Usage Guide 📖

- `/start` - Initialize the bot
- `/new` - Start a new conversation
- `/history` - View conversation history
- `/help` - Get help information
- `/switchmodel <model name>` - Switch AI model
- `/img <description> [size]` - Generate image
- `/language <language code>` - Switch interface language
- Send an image for analysis
- Send a message directly for conversation

Supported languages (use /language command):
- English (en)
- Simplified Chinese (zh-cn)
- Traditional Chinese (zh-hant)
- Japanese (ja)
- Spanish (es)
- French (fr)
- Russian (ru)
- German (de)

## Notes ⚠️

- Use API quotas reasonably, especially when using image features 💸
- Securely store environment variables and API keys 🔒
- Different AI models may have different features and limitations 🔄
- Regularly check and update dependencies to ensure security and performance 🔧

## Contribution 🤝

Welcome to submit Pull Requests or open Issues to improve this project! Your contributions will make this AI assistant more powerful and interesting.

## License 📜

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

---

About the "Deploy to Vercel" button:
This button provides a one-click deployment to Vercel, which is very convenient. However, please note:

1. The link in the button points to the original repository (https://github.com/snakeying/GPT-Telegram-Bot).
2. If you've forked this project and want to deploy your own version, you need to update this button link in the README.
3. Update method: Replace `snakeying/GPT-Telegram-Bot` in the link with your GitHub username and repository name.

For example, if your GitHub username is "yourname", you should change the button link to:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourname%2FGPT-Telegram-Bot)
```

This ensures that the "Deploy to Vercel" button will deploy your forked version, not the original repository.
