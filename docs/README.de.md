# GPT-Telegram-Bot: Multifunktionaler KI-Assistent 🤖💬

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

GPT-Telegram-Bot ist ein leistungsstarker Telegram-Bot, der verschiedene KI-Modelle integriert und intelligente Konversationen, Bildgenerierung und -analyse ermöglicht.

[![Mit Vercel bereitstellen](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnakeying%2FGPT-Telegram-Bot)

## Hauptfunktionen 🌟

1. **Unterstützung mehrerer Modelle** 🎭: Alle mit OpenAI API kompatiblen Modelle, Google Gemini, Anthropic Claude, Groq und Azure OpenAI
2. **Intelligente Konversationen** 💬: Natürlichsprachliche Interaktionen mit Kontextgedächtnis-Unterstützung
3. **Bildgenerierung** 🎨: Erstellung von Bildern basierend auf Textbeschreibungen
4. **Bildanalyse** 🔍: Interpretation und Beschreibung hochgeladener Bilder
5. **Mehrsprachige Unterstützung** 🌐: Lokalisierungsunterstützung für mehrere Sprachen
6. **Echtzeit-Antworten** ⚡: Echtzeit-Generierung und Anzeige von KI-Antworten
7. **Benutzer-Whitelist** 🔐: Kann so konfiguriert werden, dass nur bestimmte Benutzer Zugriff haben

## Unterstützte KI-Modelle 🧠

- OpenAI-Serie: Leistungsstarke Sprachmodelle 🚀
- Google Gemini: Googles KI-Modell der nächsten Generation 🧑‍🔬
- Anthropic Claude: Eine weitere leistungsstarke Sprachmodell-Option 🎭
- Groq: Hochgeschwindigkeits-Inferenz-KI-Modell ⚡
- Azure OpenAI: Von Microsoft gehosteter OpenAI-Dienst 👔

## Projektstruktur 📁

```
GPT-Telegram-Bot/
├── api/                 # API-bezogene Konfigurationen
│   └── telegram.js      # Handhabt Telegram-Bot-Interaktionen
├── src/                 # Quellcode
│   ├── bot.js           # Hauptlogik des Telegram-Bots
│   ├── api.js           # Handhabt API-Interaktionen
│   ├── config.js        # Konfigurationsdatei
│   ├── uploadhandler.js # Handhabt Bilduploads
│   └── redis.js         # Upstash Redis Datenbank-Funktionalität
├── locales/             # Mehrsprachige Unterstützungsdateien
├── package.json         # Projektabhängigkeiten
├── vercel.json          # Vercel-Konfigurationsdatei
└── .gitignore           # Git-Ignore-Datei
```

- `api/telegram.js`: Verarbeitet Webhook-Anfragen von Telegram
- `src/bot.js`: Enthält die Hauptlogik des Bots und die Befehlsverarbeitung
- `src/api.js`: Verwaltet API-Interaktionen mit verschiedenen KI-Diensten
- `src/config.js`: Speichert Projektkonfigurationen und Umgebungsvariablen
- `src/uploadhandler.js`: Handhabt die Funktionalität für Bilduploads und -analysen
- `src/redis.js`: Verwaltet Interaktionen mit Upstash Redis, verwendet zur Speicherung des Gesprächsverlaufs
- `locales/`: Enthält Übersetzungsdateien für verschiedene Sprachen, unterstützt die mehrsprachige Funktionalität

## Schnellstart 🚀

### Voraussetzungen

- [Vercel](https://vercel.com/)-Konto
- Telegram-Konto und Bot-Token
- [Upstash](https://upstash.com/) Bitte wählen Sie die Redis-Datenbank und aktivieren Sie die [Eviction](https://upstash.com/docs/redis/features/eviction)-Funktion
- API-Schlüssel für mindestens einen KI-Dienst

### Bereitstellungsschritte

1. Repository klonen:
   ```bash
   git clone https://github.com/snakeying/GPT-Telegram-Bot.git
   cd GPT-Telegram-Bot
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Umgebungsvariablen konfigurieren:
   Erstellen Sie eine `.env`-Datei und füllen Sie die erforderlichen Konfigurationsinformationen aus (siehe Umgebungsvariablen-Konfiguration unten).

4. Auf Vercel bereitstellen:
   - Forken Sie dieses Repository
   - Ändern Sie es gemäß den Anweisungen am Ende der Readme
   - Klicken Sie auf den "Mit Vercel bereitstellen"-Button
   - Verbinden Sie Ihr GitHub-Repository
   - Konfigurieren Sie die Umgebungsvariablen
   - Schließen Sie die Bereitstellung ab

5. Telegram-Webhook einrichten:
   Verwenden Sie nach der Bereitstellung die folgende URL, um den Webhook einzurichten:
   ```
   https://api.telegram.org/bot<IHR_BOT_TOKEN>/setWebhook?url=<IHRE_VERCEL_DOMAIN>/api/telegram
   ```

## Umgebungsvariablen-Konfiguration 🔧

Bevor Sie GPT-Telegram-Bot bereitstellen und ausführen, müssen Sie die folgenden Umgebungsvariablen einrichten. Erstellen Sie eine `.env`-Datei im Stammverzeichnis des Projekts und konfigurieren Sie die folgenden Variablen:

| Variablenname | Beschreibung | Standardwert |
|---------------|--------------|--------------|
| `OPENAI_API_KEY` | OpenAI API-Schlüssel | - |
| `OPENAI_BASE_URL` | OpenAI API Basis-URL | https://api.openai.com/v1 |
| `OPENAI_MODELS` | Zu verwendende OpenAI-Modelle (kommagetrennt) | - |
| `DEFAULT_MODEL` | Standardmäßig zu verwendendes Modell | Erstes Modell in OPENAI_MODELS |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API-Schlüssel | - |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI-Endpunkt | - |
| `AZURE_OPENAI_MODELS` | Zu verwendende Azure OpenAI-Modelle (kommagetrennt) | - |
| `TELEGRAM_BOT_TOKEN` | Telegram-Bot-Token | - |
| `WHITELISTED_USERS` | Erlaubte Benutzer-IDs (kommagetrennt) | - |
| `DALL_E_MODEL` | Zu verwendenes DALL-E-Modell | dall-e-3 |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST-URL | - |
| `UPSTASH_REST_TOKEN` | Upstash Redis REST-Token | - |
| `SYSTEM_INIT_MESSAGE` | System-Initialisierungsnachricht | You are a helpful assistant. |
| `SYSTEM_INIT_MESSAGE_ROLE` | Rolle der Systemnachricht | system |
| `GEMINI_API_KEY` | Google Gemini API-Schlüssel | - |
| `GOOGLE_MODELS` | Zu verwendende Google-Modelle (kommagetrennt) | - |
| `GEMINI_ENDPOINT` | Gemini API-Endpunkt | https://generativelanguage.googleapis.com/v1beta/models |
| `GROQ_API_KEY` | Groq API-Schlüssel | - |
| `GROQ_MODELS` | Zu verwendende Groq-Modelle (kommagetrennt) | - |
| `MAX_HISTORY_LENGTH` | Maximale Verlaufslänge | 50 |
| `CLAUDE_API_KEY` | Anthropic Claude API-Schlüssel | - |
| `CLAUDE_MODELS` | Zu verwendende Claude-Modelle (kommagetrennt) | - |
| `CLAUDE_ENDPOINT` | Claude API-Endpunkt | https://api.anthropic.com/v1/chat/completions |

Stellen Sie sicher, dass Sie diese Umgebungsvariablen zur Umgebungskonfiguration Ihres Projekts hinzufügen, wenn Sie es auf Vercel oder anderen Plattformen bereitstellen.

## Nutzungsanleitung 📖

- `/start` - Bot initialisieren
- `/new` - Neue Konversation starten
- `/history` - Konversationsverlauf anzeigen
- `/help` - Hilfeinformationen erhalten
- `/switchmodel <Modellname>` - KI-Modell wechseln
- `/img <Beschreibung> [Größe]` - Bild generieren
- `/language <Sprachcode>` - Schnittstellensprache ändern
- Senden Sie ein Bild zur Analyse
- Senden Sie eine Nachricht direkt für eine Konversation

Unterstützte Sprachen (verwenden Sie den /language-Befehl):
- Englisch (en)
- Vereinfachtes Chinesisch (zh-cn)
- Traditionelles Chinesisch (zh-hant)
- Japanisch (ja)
- Spanisch (es)
- Französisch (fr)
- Russisch (ru)
- Deutsch (de)

## Hinweise ⚠️

- Verwenden Sie API-Kontingente vernünftig, insbesondere bei der Nutzung von Bildfunktionen 💸
- Speichern Sie Umgebungsvariablen und API-Schlüssel sicher 🔒
- Verschiedene KI-Modelle können unterschiedliche Funktionen und Einschränkungen haben 🔄
- Überprüfen und aktualisieren Sie regelmäßig Abhängigkeiten, um Sicherheit und Leistung zu gewährleisten 🔧

## Mitwirken 🤝

Pull Requests oder das Öffnen von Issues zur Verbesserung dieses Projekts sind willkommen! Ihre Beiträge werden diesen KI-Assistenten leistungsfähiger und interessanter machen.

## Lizenz 📜

Dieses Projekt steht unter der [MIT-Lizenz](https://choosealicense.com/licenses/mit/).

---

Über den "Mit Vercel bereitstellen"-Button:
Dieser Button bietet eine Ein-Klick-Bereitstellungsfunktion auf Vercel, was sehr praktisch ist. Bitte beachten Sie jedoch:

1. Der Link im Button verweist auf das ursprüngliche Repository (https://github.com/snakeying/GPT-Telegram-Bot).
2. Wenn Sie dieses Projekt geforkt haben und Ihre eigene Version bereitstellen möchten, müssen Sie diesen Button-Link in der README aktualisieren.
3. Aktualisierungsmethode: Ersetzen Sie `snakeying/GPT-Telegram-Bot` im Link durch Ihren GitHub-Benutzernamen und Repository-Namen.

Wenn Ihr GitHub-Benutzername beispielsweise "ihrname" ist, sollten Sie den Button-Link wie folgt ändern:

```markdown
[![Mit Vercel bereitstellen](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fihrname%2FGPT-Telegram-Bot)
```

Dies stellt sicher, dass der "Mit Vercel bereitstellen"-Button Ihre geforkte Version und nicht das ursprüngliche Repository bereitstellt.
