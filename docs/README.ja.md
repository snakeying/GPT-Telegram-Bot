# GPT-Telegram-Bot：多機能 AI アシスタント 🤖💬

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

GPT-Telegram-Bot は、さまざまな AI モデルを統合し、インテリジェントな会話、画像生成、分析機能を提供する強力な Telegram ボットです。

[![Vercel でデプロイ](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnakeying%2FGPT-Telegram-Bot)

## 主な機能 🌟

1. **複数モデルのサポート** 🎭：OpenAI API 互換のモデル、Google Gemini、Anthropic Claude、Groq、Azure OpenAI
2. **インテリジェントな会話** 💬：コンテキストメモリをサポートする自然言語対話
3. **画像生成** 🎨：テキスト説明に基づいて画像を作成
4. **画像分析** 🔍：アップロードされた画像を解釈し説明
5. **多言語サポート** 🌐：複数言語のローカライゼーションをサポート
6. **ストリーミングレスポンス** ⚡：AI の返答をリアルタイムで生成・表示
7. **ユーザーホワイトリスト** 🔐：特定のユーザーのみアクセスを許可するように設定可能

## サポートされている AI モデル 🧠

- OpenAI シリーズ：強力な言語モデル 🚀
- Google Gemini：Google の次世代 AI モデル 🧑‍🔬
- Anthropic Claude：もう一つの強力な言語モデルの選択肢 🎭
- Groq：高速推論 AI モデル ⚡
- Azure OpenAI：Microsoft がホストする OpenAI サービス 👔

## プロジェクト構造 📁

```
GPT-Telegram-Bot/
├── api/                 # API 関連の設定
│   └── telegram.js      # Telegram ボットの対話を処理
├── src/                 # ソースコード
│   ├── bot.js           # Telegram ボットの主要なロジック
│   ├── api.js           # API 対話の処理
│   ├── config.js        # 設定ファイル
│   ├── uploadhandler.js # 画像アップロードの処理
│   └── redis.js         # Upstash Redis データベース機能
├── locales/             # 多言語サポートファイル
├── package.json         # プロジェクトの依存関係
├── vercel.json          # Vercel 設定ファイル
└── .gitignore           # Git 無視ファイル
```

- `api/telegram.js`: Telegram からの webhook リクエストを処理
- `src/bot.js`: ボットの主要なロジックとコマンド処理を含む
- `src/api.js`: 異なる AI サービスとの API 対話を管理
- `src/config.js`: プロジェクトの設定と環境変数を格納
- `src/uploadhandler.js`: 画像アップロードと分析機能を処理
- `src/redis.js`: Upstash Redis との対話を管理し、会話履歴を保存
- `locales/`: 異なる言語の翻訳ファイルを含み、多言語機能をサポート

## クイックスタート 🚀

### 前提条件

- [Vercel](https://vercel.com/) アカウント
- Telegram アカウントとボットトークン
- [Upstash](https://upstash.com/) Redisデータベースを選択し、[Eviction](https://upstash.com/docs/redis/features/eviction) 機能を有効にしてください
- 少なくとも1つの AI サービスの API キー

### デプロイ手順

1. リポジトリをクローン：
   ```bash
   git clone https://github.com/snakeying/GPT-Telegram-Bot.git
   cd GPT-Telegram-Bot
   ```

2. 依存関係をインストール：
   ```bash
   npm install
   ```

3. 環境変数を設定：
   `.env` ファイルを作成し、必要な設定情報を入力します（下記の環境変数設定を参照）。

4. Vercel にデプロイ：
   - このリポジトリを Fork
   - readme の最下部の指示に従って修正
   - 「Vercel でデプロイ」ボタンをクリック
   - GitHub リポジトリを接続
   - 環境変数を設定
   - デプロイを完了

5. Telegram Webhook を設定：
   デプロイ完了後、以下の URL を使用して Webhook を設定：
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_VERCEL_DOMAIN>/api/telegram
   ```

## 環境変数設定 🔧

GPT-Telegram-Bot をデプロイ・実行する前に、以下の環境変数を設定する必要があります。プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下の変数を設定してください：

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `OPENAI_API_KEY` | OpenAI API キー | - |
| `OPENAI_BASE_URL` | OpenAI API ベース URL | https://api.openai.com/v1 |
| `OPENAI_MODELS` | 使用する OpenAI モデル（カンマ区切り） | - |
| `DEFAULT_MODEL` | デフォルトで使用するモデル | OPENAI_MODELS の最初のモデル |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API キー | - |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI エンドポイント | - |
| `AZURE_OPENAI_MODELS` | 使用する Azure OpenAI モデル（カンマ区切り） | - |
| `TELEGRAM_BOT_TOKEN` | Telegram ボットトークン | - |
| `WHITELISTED_USERS` | 許可するユーザー ID（カンマ区切り） | - |
| `DALL_E_MODEL` | 使用する DALL-E モデル | dall-e-3 |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | - |
| `UPSTASH_REST_TOKEN` | Upstash Redis REST トークン | - |
| `SYSTEM_INIT_MESSAGE` | システム初期化メッセージ | You are a helpful assistant. |
| `SYSTEM_INIT_MESSAGE_ROLE` | システムメッセージの役割 | system |
| `GEMINI_API_KEY` | Google Gemini API キー | - |
| `GOOGLE_MODELS` | 使用する Google モデル（カンマ区切り） | - |
| `GEMINI_ENDPOINT` | Gemini API エンドポイント | https://generativelanguage.googleapis.com/v1beta/models |
| `GROQ_API_KEY` | Groq API キー | - |
| `GROQ_MODELS` | 使用する Groq モデル（カンマ区切り） | - |
| `MAX_HISTORY_LENGTH` | 最大履歴長 | 50 |
| `CLAUDE_API_KEY` | Anthropic Claude API キー | - |
| `CLAUDE_MODELS` | 使用する Claude モデル（カンマ区切り） | - |
| `CLAUDE_ENDPOINT` | Claude API エンドポイント | https://api.anthropic.com/v1/chat/completions |

Vercel やその他のプラットフォームにデプロイする際は、これらの環境変数をプロジェクトの環境設定に追加してください。

## 使用ガイド 📖

- `/start` - ボットを初期化
- `/new` - 新しい会話を開始
- `/history` - 会話履歴を表示
- `/help` - ヘルプ情報を取得
- `/switchmodel <モデル名>` - AI モデルを切り替え
- `/img <説明> [サイズ]` - 画像を生成
- `/language <言語コード>` - インターフェース言語を切り替え
- 画像を送信して分析
- メッセージを直接送信して会話

サポートされている言語（/language コマンドを使用）：
- 英語 (en)
- 簡体字中国語 (zh-cn)
- 繁体字中国語 (zh-hant)
- 日本語 (ja)
- スペイン語 (es)
- フランス語 (fr)
- ロシア語 (ru)
- ドイツ語 (de)

## 注意事項 ⚠️

- API クォータを適切に使用してください。特に画像機能を使用する際は注意が必要です 💸
- 環境変数と API キーを安全に保管してください 🔒
- 異なる AI モデルには異なる特性と制限がある場合があります 🔄
- セキュリティと性能を確保するために、定期的に依存関係を確認・更新してください 🔧

## 貢献 🤝

プロジェクトを改善するための Pull Request や Issue の提出を歓迎します！皆様の貢献により、この AI アシスタントはより強力で面白いものになります。

## ライセンス 📜

このプロジェクトは [MIT ライセンス](https://choosealicense.com/licenses/mit/)の下で公開されています。

---

「Vercel でデプロイ」ボタンについて：
このボタンは Vercel へのワンクリックデプロイ機能を提供し、非常に便利です。ただし、以下の点に注意してください：

1. ボタン内のリンクは元のリポジトリ（https://github.com/snakeying/GPT-Telegram-Bot）を指しています。
2. このプロジェクトを Fork して自分のバージョンをデプロイしたい場合は、README 内のこのボタンリンクを更新する必要があります。
3. 更新方法：リンク内の `snakeying/GPT-Telegram-Bot` を自分の GitHub ユーザー名とリポジトリ名に置き換えてください。

例えば、GitHub ユーザー名が "yourname" の場合、ボタンのリンクを以下のように変更します：

```markdown
[![Vercel でデプロイ](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourname%2FGPT-Telegram-Bot)
```

これにより、「Vercel でデプロイ」ボタンが元のリポジトリではなく、Fork したバージョンをデプロイすることを確認できます。
