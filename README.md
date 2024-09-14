# GPT-Telegram-Bot

GPT-Telegram-Bot 是一个可调用 OpenAI 兼容的 API，进行文本对话、图像生成和图像分析等任务的Telegram 机器人。你可以部署在 Vercel 上，使用 Upstash Redis 进行对话历史管理。

## 功能特性

1. **智能对话**：使用 OpenAI 的 GPT 模型进行自然语言对话。
2. **多模型支持**：可以在多个 OpenAI 模型之间切换。
3. **对话历史**：保存用户对话历史，实现上下文理解。
4. **图像生成**：使用 DALL-E 3 模型生成图像。
5. **图像分析**：分析用户上传的图片并提供描述。
6. **流式响应**：使用流式 API 实现实时回复。
7. **用户白名单**：仅允许特定用户使用机器人。

## 部署教程

### 前置要求

- [Vercel](https://vercel.com/) 账号
- [OpenAI](https://openai.com/) API 密钥
- [Telegram](https://telegram.org/) 账号和 Bot Token
- [Upstash](https://upstash.com/) Redis 数据库

### 步骤 1: 克隆仓库

```bash
git clone https://github.com/your-username/GPT-Telegram-Bot.git
cd GPT-Telegram-Bot
```

### 步骤 2: 安装依赖

```bash
npm install
```

### 步骤 3: 配置环境变量

在项目根目录创建 `.env` 文件，并填入以下内容：

```
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODELS=gpt-4,gpt-3.5-turbo
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
WHITELISTED_USERS=user_id_1,user_id_2
DALL_E_MODEL=dall-e-3
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REST_TOKEN=your_upstash_redis_token
SYSTEM_INIT_MESSAGE=You are a helpful assistant.
SYSTEM_INIT_MESSAGE_ROLE=system
```

请确保替换所有的占位符为您的实际值。

### 步骤 4: 部署到 Vercel

1. 在 Vercel 上创建新项目。
2. 连接您的 GitHub 仓库。
3. 在项目设置中，添加上面的环境变量。
4. 部署项目。

### 步骤 5: 设置 Telegram Webhook

部署完成后，您需要设置 Telegram Webhook。将以下 URL 中的占位符替换为您的实际值，然后在浏览器中访问：

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_VERCEL_DOMAIN>/api/telegram
```

## 使用说明

- `/start`: 开始使用机器人
- `/new`: 开始新对话，清除历史记录
- `/history`: 查看对话历史
- `/help`: 获取帮助信息
- `/switchmodel <model_name>`: 切换到指定的 OpenAI 模型
- `/img <prompt> [size]`: 生成图像（可选大小：1024x1024, 1792x1024, 1024x1792）
- 发送图片：上传图片进行分析

## 注意事项

- 确保您的 OpenAI API 密钥有足够的额度。
- 图片生成和分析功能可能会消耗较多 API 额度。
- 保护好您的环境变量，不要泄露给他人。

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大变更，请先开 issue 讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
