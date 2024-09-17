# GPT-Telegram-Bot: Asistente de IA Multifuncional 🤖💬

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

GPT-Telegram-Bot es un potente bot de Telegram que integra varios modelos de IA, proporcionando conversaciones inteligentes, generación y análisis de imágenes.

[![Desplegar con Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnakeying%2FGPT-Telegram-Bot)

## Características Principales 🌟

1. **Soporte Multi-modelo** 🎭: Cualquier modelo compatible con la API de OpenAI, Google Gemini, Anthropic Claude, Groq y Azure OpenAI
2. **Conversaciones Inteligentes** 💬: Interacciones en lenguaje natural con soporte de memoria contextual
3. **Generación de Imágenes** 🎨: Crea imágenes basadas en descripciones de texto
4. **Análisis de Imágenes** 🔍: Interpreta y describe imágenes subidas
5. **Soporte Multilingüe** 🌐: Soporte de localización para múltiples idiomas
6. **Respuesta en Tiempo Real** ⚡: Generación y visualización en tiempo real de las respuestas de la IA
7. **Lista Blanca de Usuarios** 🔐: Se puede configurar para permitir acceso solo a usuarios específicos

## Modelos de IA Soportados 🧠

- Serie OpenAI: Potentes modelos de lenguaje 🚀
- Google Gemini: Modelo de IA de próxima generación de Google 🧑‍🔬
- Anthropic Claude: Otra potente opción de modelo de lenguaje 🎭
- Groq: Modelo de IA de inferencia de alta velocidad ⚡
- Azure OpenAI: Servicio OpenAI alojado por Microsoft 👔

## Estructura del Proyecto 📁

```
GPT-Telegram-Bot/
├── api/                 # Configuraciones relacionadas con la API
│   └── telegram.js      # Maneja las interacciones del bot de Telegram
├── src/                 # Código fuente
│   ├── bot.js           # Lógica principal del bot de Telegram
│   ├── api.js           # Maneja las interacciones de la API
│   ├── config.js        # Archivo de configuración
│   ├── uploadhandler.js # Maneja la subida de imágenes
│   └── redis.js         # Funcionalidad de la base de datos Upstash Redis
├── locales/             # Archivos de soporte multilingüe
├── package.json         # Dependencias del proyecto
├── vercel.json          # Archivo de configuración de Vercel
└── .gitignore           # Archivo de ignorados de Git
```

- `api/telegram.js`: Maneja las solicitudes webhook de Telegram
- `src/bot.js`: Contiene la lógica principal del bot y el procesamiento de comandos
- `src/api.js`: Gestiona las interacciones de la API con diferentes servicios de IA
- `src/config.js`: Almacena las configuraciones del proyecto y las variables de entorno
- `src/uploadhandler.js`: Maneja la funcionalidad de subida y análisis de imágenes
- `src/redis.js`: Gestiona las interacciones con Upstash Redis, utilizado para almacenar el historial de conversaciones
- `locales/`: Contiene archivos de traducción para diferentes idiomas, soportando la funcionalidad multilingüe

## Inicio Rápido 🚀

### Requisitos Previos

- Cuenta de [Vercel](https://vercel.com/)
- Cuenta de Telegram y Token de Bot
- Base de datos [Upstash](https://upstash.com/) Por favor, selecciona la base de datos Redis y habilita la función de [Eviction](https://upstash.com/docs/redis/features/eviction)
- Clave API para al menos un servicio de IA

### Pasos de Despliegue

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/snakeying/GPT-Telegram-Bot.git
   cd GPT-Telegram-Bot
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crea un archivo `.env` y completa la información de configuración necesaria (consulta la configuración de variables de entorno más abajo).

4. Desplegar en Vercel:
   - Haz un fork de este repositorio
   - Modifica según las instrucciones al final del readme
   - Haz clic en el botón "Desplegar con Vercel"
   - Conecta tu repositorio de GitHub
   - Configura las variables de entorno
   - Completa el despliegue

5. Configurar el Webhook de Telegram:
   Después del despliegue, utiliza la siguiente URL para configurar el Webhook:
   ```
   https://api.telegram.org/bot<TU_TOKEN_DE_BOT>/setWebhook?url=<TU_DOMINIO_DE_VERCEL>/api/telegram
   ```

## Configuración de Variables de Entorno 🔧

Antes de desplegar y ejecutar GPT-Telegram-Bot, necesitas configurar las siguientes variables de entorno. Crea un archivo `.env` en el directorio raíz del proyecto y configura las siguientes variables:

| Nombre de Variable | Descripción | Valor por Defecto |
|--------------------|-------------|-------------------|
| `OPENAI_API_KEY` | Clave API de OpenAI | - |
| `OPENAI_BASE_URL` | URL base de la API de OpenAI | https://api.openai.com/v1 |
| `OPENAI_MODELS` | Modelos de OpenAI a usar (separados por comas) | - |
| `DEFAULT_MODEL` | Modelo a usar por defecto | Primer modelo en OPENAI_MODELS |
| `AZURE_OPENAI_API_KEY` | Clave API de Azure OpenAI | - |
| `AZURE_OPENAI_ENDPOINT` | Endpoint de Azure OpenAI | - |
| `AZURE_OPENAI_MODELS` | Modelos de Azure OpenAI a usar (separados por comas) | - |
| `TELEGRAM_BOT_TOKEN` | Token del Bot de Telegram | - |
| `WHITELISTED_USERS` | IDs de usuario permitidos (separados por comas) | - |
| `DALL_E_MODEL` | Modelo DALL-E a usar | dall-e-3 |
| `UPSTASH_REDIS_REST_URL` | URL REST de Upstash Redis | - |
| `UPSTASH_REST_TOKEN` | Token REST de Upstash Redis | - |
| `SYSTEM_INIT_MESSAGE` | Mensaje de inicialización del sistema | You are a helpful assistant. |
| `SYSTEM_INIT_MESSAGE_ROLE` | Rol del mensaje del sistema | system |
| `GEMINI_API_KEY` | Clave API de Google Gemini | - |
| `GOOGLE_MODELS` | Modelos de Google a usar (separados por comas) | - |
| `GEMINI_ENDPOINT` | Endpoint de la API de Gemini | https://generativelanguage.googleapis.com/v1beta/models |
| `GROQ_API_KEY` | Clave API de Groq | - |
| `GROQ_MODELS` | Modelos de Groq a usar (separados por comas) | - |
| `MAX_HISTORY_LENGTH` | Longitud máxima del historial | 50 |
| `CLAUDE_API_KEY` | Clave API de Anthropic Claude | - |
| `CLAUDE_MODELS` | Modelos de Claude a usar (separados por comas) | - |
| `CLAUDE_ENDPOINT` | Endpoint de la API de Claude | https://api.anthropic.com/v1/chat/completions |

Asegúrate de añadir estas variables de entorno a la configuración de entorno de tu proyecto cuando lo despliegues en Vercel u otras plataformas.

## Guía de Uso 📖

- `/start` - Inicializar el bot
- `/new` - Iniciar una nueva conversación
- `/history` - Ver el historial de conversación
- `/help` - Obtener información de ayuda
- `/switchmodel <nombre del modelo>` - Cambiar el modelo de IA
- `/img <descripción> [tamaño]` - Generar imagen
- `/language <código de idioma>` - Cambiar el idioma de la interfaz
- Envía una imagen para analizarla
- Envía un mensaje directamente para conversar

Idiomas soportados (usa el comando /language):
- Inglés (en)
- Chino Simplificado (zh-cn)
- Chino Tradicional (zh-hant)
- Japonés (ja)
- Español (es)
- Francés (fr)
- Ruso (ru)
- Alemán (de)

## Notas ⚠️

- Usa las cuotas de API de manera razonable, especialmente al usar funciones de imágenes 💸
- Almacena de forma segura las variables de entorno y las claves API 🔒
- Diferentes modelos de IA pueden tener diferentes características y limitaciones 🔄
- Verifica y actualiza las dependencias regularmente para garantizar la seguridad y el rendimiento 🔧

## Contribución 🤝

¡Bienvenidas las Pull Requests o la apertura de Issues para mejorar este proyecto! Tus contribuciones harán que este asistente de IA sea más potente e interesante.

## Licencia 📜

Este proyecto está licenciado bajo la [Licencia MIT](https://choosealicense.com/licenses/mit/).

---

Sobre el botón "Desplegar con Vercel":
Este botón proporciona una función de despliegue con un clic en Vercel, lo cual es muy conveniente. Sin embargo, ten en cuenta:

1. El enlace en el botón apunta al repositorio original (https://github.com/snakeying/GPT-Telegram-Bot).
2. Si has hecho un fork de este proyecto y quieres desplegar tu propia versión, necesitas actualizar este enlace del botón en el README.
3. Método de actualización: Reemplaza `snakeying/GPT-Telegram-Bot` en el enlace con tu nombre de usuario de GitHub y el nombre del repositorio.

Por ejemplo, si tu nombre de usuario de GitHub es "tunombre", deberías cambiar el enlace del botón a:

```markdown
[![Desplegar con Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftunombre%2FGPT-Telegram-Bot)
```

Esto asegura que el botón "Desplegar con Vercel" desplegará tu versión forkeada, no el repositorio original.
