# 🤖 GPT-Telegram-Bot：你的多才多艺 AI 助手！

嘿，欢迎来到 GPT-Telegram-Bot 的奇妙世界！这个小机器人不仅能陪你聊天解闷，还能变身为你的私人画家和图片解读大师。最棒的是，它懂多种"外语"（不同的 AI 模型啦），随时准备跟你展开一场脑洞大开的对话冒险！

## 🌟 这个机器人能做啥好玩的？

1. 🗣️ **话痨模式**：它能跟你聊到天荒地老，用多种 AI 模型陪你度过无聊时光。
2. 🎭 **百变大咖**：厌倦了一个 AI？换一个呗！多种模型任你挑选，找到最懂你的那个。
3. 🧠 **记忆超群**：过目不忘的对话历史，让你们的闲聊永远有话题。
4. 🎨 **绘画小能手**：说出你的幻想，它能画给你看（别指望它能进艺术学院就是了）。
5. 🔍 **图片福尔摩斯**：给它看张图，它能给你讲出一个故事（脑补成分因人而异）。
6. 💨 **急性子福音**：讨厌等待？它用流式回复帮你省去干等的痛苦。
7. 🔐 **专属VIP**：只为特定用户服务，你就是那个特别的人！

## 🧠 这机器人有多聪明？

它懂得"说"的语言可不少：
- OpenAI 的 GPT 系列：最擅长装大神
- Google 的 Gemini：来自谷歌的新秀，懂点儿算术
- Anthropic 的 Claude：最会装傻卖萌
- Groq 的模型：速度快得像闪电侠
- Azure OpenAI：微软给 OpenAI 穿上了西装

## 🚀 怎么把这个机器人带回家？

### 准备工作（别慌，很简单）

- [Vercel](https://vercel.com/) 账号：你的机器人的豪华公寓
- 至少一个 AI 朋友的电话号码（API 密钥啦）
- [Telegram](https://telegram.org/) 账号和 Bot Token：没它们机器人就是个哑巴
- [Upstash](https://upstash.com/) Redis 数据库：机器人的超级记忆仓库

### 第 1 步：复制一份机器人的 DNA

```bash
git clone https://github.com/snakeying/GPT-Telegram-Bot.git
cd GPT-Telegram-Bot
```

### 第 2 步：给机器人喂饭（安装依赖）

```bash
npm install
```

### 第 3 步：教机器人你的密码（配置环境变量）

创建一个 `.env` 文件，往里面塞这些神秘代码：

```
TELEGRAM_BOT_TOKEN=你的_telegram_机器人_令牌
WHITELISTED_USERS=允许使用的用户ID,用逗号分隔
UPSTASH_REDIS_REST_URL=你的_upstash_redis_网址
UPSTASH_REST_TOKEN=你的_upstash_redis_令牌
SYSTEM_INIT_MESSAGE=你是个有趣的助手。
SYSTEM_INIT_MESSAGE_ROLE=system
DEFAULT_MODEL=你默认喜欢的模型名称

# OpenAI 的秘密手势（选填）
OPENAI_API_KEY=你的_openai_api_密钥
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODELS=gpt-4,gpt-3.5-turbo
DALL_E_MODEL=dall-e-3

# Google Gemini 的暗号（选填）
GEMINI_API_KEY=你的_gemini_api_密钥
GOOGLE_MODELS=gemini-pro,gemini-pro-vision

# Anthropic Claude 的咒语（选填）
CLAUDE_API_KEY=你的_claude_api_密钥
CLAUDE_MODELS=claude-2,claude-instant-1

# Groq 的飞行密码（选填）
GROQ_API_KEY=你的_groq_api_密钥
GROQ_MODELS=llama2-70b-4096,mixtral-8x7b-32768

# Azure OpenAI 的通关密语（选填）
AZURE_OPENAI_API_KEY=你的_azure_openai_api_密钥
AZURE_OPENAI_ENDPOINT=你的_azure_openai_端点
AZURE_OPENAI_MODELS=你的-gpt-4-部署名,你的-gpt-35-turbo-部署名
```

别忘了把里面的 "你的_xxx" 替换成真实的值哦，不然机器人会闹脾气的！

### 第 4 步：给机器人找个家（部署到 Vercel）

1. 在 Vercel 上开一间新房（创建项目）。
2. 把你的 GitHub 仓库和 Vercel 牵个线。
3. 偷偷告诉 Vercel 你的小秘密（环境变量）。
4. 按下神奇的部署按钮！

### 第 5 步：告诉 Telegram 你的机器人住哪儿

部署完成后，用下面的魔法链接（记得换掉占位符）告诉 Telegram 你的机器人的新地址：

```
https://api.telegram.org/bot<你的机器人令牌>/setWebhook?url=<你的Vercel域名>/api/telegram
```

## 📖 使用指南：如何驾驭你的 AI 小精灵

- `/start`: 跟机器人打个招呼，开始你们的精彩故事
- `/new`: 失忆模式启动！忘记过去，重新开始
- `/history`: 回顾你们的甜蜜回忆（不，只是对话历史）
- `/help`: 求助热线，遇到问题就呼叫
- `/switchmodel <模型名称>`: 给你的 AI 换个新发型（切换模型）
- `/img <描述> [尺寸]`: 变身艺术家，画出你心中的杰作
- 发送图片：让 AI 化身福尔摩斯，推理图中奥秘
- 直接发消息：跟 AI 开启漫无边际的脑洞之旅

## ⚠️ 注意事项（认真脸）

- 别把 API 用光了，不然你的 AI 朋友会饿肚子的。
- 图片功能很酷，但也很能吃 API 额度，慎用！
- 保护好你的小秘密（环境变量），别让坏人知道了。
- 每个 AI 模型都有自己的小脾气，要多多包容哦。

## 🤝 来帮忙吧！

发现了让机器人更好玩的方法？快来提交 Pull Request 吧！有什么天马行空的想法？开个 issue 让大家一起头脑风暴！

## 📜 许可证

[MIT](https://choosealicense.com/licenses/mit/)

记住，AI 是你的朋友，不是替代品。多陪陪你身边的真人，偶尔和 AI 聊聊天，让生活更有趣！现在，开始你的 AI 冒险吧！🚀✨
