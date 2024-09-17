# GPT-Telegram-Bot：多功能 AI 助手 🤖💬

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

GPT-Telegram-Bot 是一個功能強大的 Telegram 機器人，整合了多種 AI 模型，提供智慧對話、圖像生成和分析等功能。

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnakeying%2FGPT-Telegram-Bot)

## 主要功能 🌟

1. **多模型支援** 🎭：任何與 OpenAI API 相容的模型、Google Gemini、Anthropic Claude、Groq 和 Azure OpenAI
2. **智慧對話** 💬：支援上下文記憶的自然語言互動
3. **圖像生成** 🎨：根據文字描述創建圖像
4. **圖像分析** 🔍：解讀並描述上傳的圖片
5. **多語言支援** 🌐：支援多種語言的在地化
6. **串流回應** ⚡：即時生成和顯示 AI 回覆
7. **使用者白名單** 🔐：可設定僅允許特定使用者存取

## 支援的 AI 模型 🧠

- OpenAI 系列：強大的語言模型 🚀
- Google Gemini：Google 的新一代 AI 模型 🧑‍🔬
- Anthropic Claude：另一個強大的語言模型選擇 🎭
- Groq：高速推理的 AI 模型 ⚡
- Azure OpenAI：微軟託管的 OpenAI 服務 👔

## 專案結構 📁

```
GPT-Telegram-Bot/
├── api/                 # API 相關配置
│   └── telegram.js      # 處理 Telegram bot 互動
├── src/                 # 原始碼
│   ├── bot.js           # 主要的 Telegram bot 邏輯
│   ├── api.js           # 處理 API 互動
│   ├── config.js        # 設定檔
│   ├── uploadhandler.js # 處理圖片上傳
│   └── redis.js         # Upstash Redis 資料庫功能
├── locales/             # 多語言支援檔案
├── package.json         # 專案相依套件
├── vercel.json          # Vercel 設定檔
└── .gitignore           # Git 忽略檔案
```

- `api/telegram.js`: 處理來自 Telegram 的 webhook 請求
- `src/bot.js`: 包含主要的機器人邏輯和指令處理
- `src/api.js`: 管理與不同 AI 服務的 API 互動
- `src/config.js`: 儲存專案設定和環境變數
- `src/uploadhandler.js`: 處理圖片上傳和分析功能
- `src/redis.js`: 管理與 Upstash Redis 的互動，用於儲存對話歷史
- `locales/`: 包含不同語言的翻譯檔案，支援多語言功能

## 快速開始 🚀

### 前置要求

- [Vercel](https://vercel.com/) 帳號
- Telegram 帳號和 Bot Token
- [Upstash](https://upstash.com/) 請選擇 Redis 數據庫並啟用 [Eviction](https://upstash.com/docs/redis/features/eviction) 功能
- 至少一個 AI 服務的 API 金鑰

### 部署步驟

1. 複製儲存庫：
   ```bash
   git clone https://github.com/snakeying/GPT-Telegram-Bot.git
   cd GPT-Telegram-Bot
   ```

2. 安裝相依套件：
   ```bash
   npm install
   ```

3. 設定環境變數：
   建立 `.env` 檔案並填入必要的設定資訊（參考下方的環境變數設定）。

4. 部署到 Vercel：
   - Fork 這個儲存庫
   - 按照 readme 最下方的指引修改
   - 點擊「使用 Vercel 部署」按鈕
   - 連接你的 GitHub 儲存庫
   - 設定環境變數
   - 完成部署

5. 設定 Telegram Webhook：
   部署完成後，使用以下 URL 設定 Webhook：
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_VERCEL_DOMAIN>/api/telegram
   ```

## 環境變數設定 🔧

在部署和運行 GPT-Telegram-Bot 之前，您需要設定以下環境變數。在專案根目錄下建立一個 `.env` 檔案，並設定以下變數：

| 變數名 | 描述 | 預設值 |
|--------|------|--------|
| `OPENAI_API_KEY` | OpenAI API 金鑰 | - |
| `OPENAI_BASE_URL` | OpenAI API 基礎 URL | https://api.openai.com/v1 |
| `OPENAI_MODELS` | 使用的 OpenAI 模型（逗號分隔） | - |
| `DEFAULT_MODEL` | 預設使用的模型 | OPENAI_MODELS 的第一個模型 |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API 金鑰 | - |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI 端點 | - |
| `AZURE_OPENAI_MODELS` | 使用的 Azure OpenAI 模型（逗號分隔） | - |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | - |
| `WHITELISTED_USERS` | 允許使用的使用者 ID（逗號分隔） | - |
| `DALL_E_MODEL` | 使用的 DALL-E 模型 | dall-e-3 |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | - |
| `UPSTASH_REST_TOKEN` | Upstash Redis REST Token | - |
| `SYSTEM_INIT_MESSAGE` | 系統初始化訊息 | You are a helpful assistant. |
| `SYSTEM_INIT_MESSAGE_ROLE` | 系統訊息角色 | system |
| `GEMINI_API_KEY` | Google Gemini API 金鑰 | - |
| `GOOGLE_MODELS` | 使用的 Google 模型（逗號分隔） | - |
| `GEMINI_ENDPOINT` | Gemini API 端點 | https://generativelanguage.googleapis.com/v1beta/models |
| `GROQ_API_KEY` | Groq API 金鑰 | - |
| `GROQ_MODELS` | 使用的 Groq 模型（逗號分隔） | - |
| `MAX_HISTORY_LENGTH` | 最大歷史記錄長度 | 50 |
| `CLAUDE_API_KEY` | Anthropic Claude API 金鑰 | - |
| `CLAUDE_MODELS` | 使用的 Claude 模型（逗號分隔） | - |
| `CLAUDE_ENDPOINT` | Claude API 端點 | https://api.anthropic.com/v1/chat/completions |

請確保在部署到 Vercel 或其他平台時，將這些環境變數添加到專案的環境設定中。

## 使用指南 📖

- `/start` - 初始化機器人
- `/new` - 開始新的對話
- `/history` - 查看對話歷史
- `/help` - 獲取說明資訊
- `/switchmodel <模型名稱>` - 切換 AI 模型
- `/img <描述> [尺寸]` - 生成圖像
- `/language <語言代碼>` - 切換介面語言
- 發送圖片以進行分析
- 直接發送訊息進行對話

支援的語言（使用 /language 指令）：
- 英語 (en)
- 簡體中文 (zh-cn)
- 繁體中文 (zh-hant)
- 日語 (ja)
- 西班牙語 (es)
- 法語 (fr)
- 俄語 (ru)
- 德語 (de)

## 注意事項 ⚠️

- 合理使用 API 配額，特別是在使用圖像功能時 💸
- 妥善保管環境變數和 API 金鑰 🔒
- 不同 AI 模型可能有不同的特性和限制 🔄
- 定期檢查和更新相依套件，以確保安全性和效能 🔧

## 貢獻 🤝

歡迎提交 Pull Requests 或開啟 Issues 來改進這個專案！您的貢獻將使這個 AI 助理變得更加強大和有趣。

## 授權條款 📜

本專案採用 [MIT 授權條款](https://choosealicense.com/licenses/mit/)。

---

關於「使用 Vercel 部署」按鈕：
這個按鈕提供了一鍵部署到 Vercel 的功能，非常方便。但是，請注意：

1. 按鈕中的連結指向的是原始儲存庫（https://github.com/snakeying/GPT-Telegram-Bot）。
2. 如果您 fork 了這個專案並希望部署您自己的版本，您需要更新 README 中的這個按鈕連結。
3. 更新方法：將連結中的 `snakeying/GPT-Telegram-Bot` 替換為您的 GitHub 使用者名稱和儲存庫名稱。

例如，如果您的 GitHub 使用者名稱是 "yourname"，您應該將按鈕的連結更改為：

```markdown
[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourname%2FGPT-Telegram-Bot)
```

這樣可以確保「使用 Vercel 部署」按鈕會部署您 fork 的版本，而不是原始儲存庫。
