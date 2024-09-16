# GPT-Telegram-Bot：多功能 AI 助手 🤖💬

[English](./README.en.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

GPT-Telegram-Bot 是一个功能强大的 Telegram 机器人，集成了多种 AI 模型，提供智能对话、图像生成和分析等功能。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnakeying%2FGPT-Telegram-Bot)

## 主要功能 🌟

1. **多模型支持** 🎭：集成 OpenAI GPT、Google Gemini、Anthropic Claude、Groq 和 Azure OpenAI
2. **智能对话** 💬：支持上下文记忆的自然语言交互
3. **图像生成** 🎨：基于文字描述创建图像
4. **图像分析** 🔍：解读并描述上传的图片
5. **多语言支持** 🌐：支持多种语言的本地化
6. **流式响应** ⚡：实时生成和显示 AI 回复
7. **用户白名单** 🔐：可设置仅允许特定用户访问

## 支持的 AI 模型 🧠

- OpenAI GPT 系列：强大的语言模型 🚀
- Google Gemini：Google 的新一代 AI 模型 🧑‍🔬
- Anthropic Claude：另一个强大的语言模型选择 🎭
- Groq：高速推理的 AI 模型 ⚡
- Azure OpenAI：微软托管的 OpenAI 服务 👔

## 快速开始 🚀

### 前置要求

- [Vercel](https://vercel.com/) 账号
- Telegram 账号和 Bot Token
- [Upstash](https://upstash.com/) Redis 数据库
- 至少一个 AI 服务的 API 密钥

### 部署步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/snakeying/GPT-Telegram-Bot.git
   cd GPT-Telegram-Bot
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量：
   创建 `.env` 文件并填入必要的配置信息（参考 `.env.example`）。

4. 部署到 Vercel：
   - 点击上方的 "Deploy with Vercel" 按钮
   - 连接你的 GitHub 仓库
   - 配置环境变量
   - 完成部署

5. 设置 Telegram Webhook：
   部署完成后，使用以下 URL 设置 Webhook：
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_VERCEL_DOMAIN>/api/telegram
   ```

## 使用指南 📖

- `/start` - 初始化机器人
- `/new` - 开始新的对话
- `/history` - 查看对话历史
- `/help` - 获取帮助信息
- `/switchmodel <模型名称>` - 切换 AI 模型
- `/img <描述> [尺寸]` - 生成图像
- `/language <语言代码>` - 切换界面语言
- 发送图片以进行分析
- 直接发送消息进行对话

支持的语言（使用 /language 命令）：
- 英语 (en)
- 简体中文 (zh-cn)
- 繁体中文 (zh-hant)
- 日语 (ja)
- 西班牙语 (es)
- 法语 (fr)
- 俄语 (ru)
- 德语 (de)

## 注意事项 ⚠️

- 合理使用 API 配额，特别是在使用图像功能时 💸
- 妥善保管环境变量和 API 密钥 🔒
- 不同 AI 模型可能有不同的特性和限制 🔄
- 定期检查和更新依赖，以确保安全性和性能 🔧

## 贡献 🤝

欢迎提交 Pull Requests 或开 Issues 来改进这个项目！您的贡献将使这个 AI 助手变得更加强大和有趣。

## 许可证 📜

本项目采用 [MIT 许可证](https://choosealicense.com/licenses/mit/)。

---

关于 "Deploy to Vercel" 按钮：
这个按钮提供了一键部署到 Vercel 的功能，非常方便。但是，请注意：

1. 按钮中的链接指向的是原始仓库（https://github.com/snakeying/GPT-Telegram-Bot）。
2. 如果您 fork 了这个项目并希望部署您自己的版本，您需要更新 README 中的这个按钮链接。
3. 更新方法：将链接中的 `snakeying/GPT-Telegram-Bot` 替换为您的 GitHub 用户名和仓库名。

例如，如果您的 GitHub 用户名是 "yourname"，您应该将按钮的链接更改为：

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourname%2FGPT-Telegram-Bot)
```

这样可以确保 "Deploy to Vercel" 按钮会部署您 fork 的版本，而不是原始仓库。
