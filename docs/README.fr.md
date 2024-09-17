# GPT-Telegram-Bot : Assistant IA Multifonctionnel 🤖💬

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

GPT-Telegram-Bot est un puissant bot Telegram qui intègre divers modèles d'IA, offrant des conversations intelligentes, ainsi que des capacités de génération et d'analyse d'images.

[![Déployer avec Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnakeying%2FGPT-Telegram-Bot)

## Fonctionnalités Principales 🌟

1. **Support Multi-modèles** 🎭 : Tout modèle compatible avec l'API OpenAI, Google Gemini, Anthropic Claude, Groq et Azure OpenAI
2. **Conversations Intelligentes** 💬 : Interactions en langage naturel avec support de mémoire contextuelle
3. **Génération d'Images** 🎨 : Création d'images basées sur des descriptions textuelles
4. **Analyse d'Images** 🔍 : Interprétation et description des images téléchargées
5. **Support Multilingue** 🌐 : Prise en charge de la localisation pour plusieurs langues
6. **Réponse en Temps Réel** ⚡ : Génération et affichage en temps réel des réponses de l'IA
7. **Liste Blanche d'Utilisateurs** 🔐 : Peut être configuré pour n'autoriser l'accès qu'à des utilisateurs spécifiques

## Modèles d'IA Pris en Charge 🧠

- Série OpenAI : Modèles de langage puissants 🚀
- Google Gemini : Modèle d'IA de nouvelle génération de Google 🧑‍🔬
- Anthropic Claude : Une autre option puissante de modèle de langage 🎭
- Groq : Modèle d'IA d'inférence haute vitesse ⚡
- Azure OpenAI : Service OpenAI hébergé par Microsoft 👔

## Structure du Projet 📁

```
GPT-Telegram-Bot/
├── api/                 # Configurations liées à l'API
│   └── telegram.js      # Gestion des interactions du bot Telegram
├── src/                 # Code source
│   ├── bot.js           # Logique principale du bot Telegram
│   ├── api.js           # Gestion des interactions API
│   ├── config.js        # Fichier de configuration
│   ├── uploadhandler.js # Gestion des téléchargements d'images
│   └── redis.js         # Fonctionnalité de base de données Upstash Redis
├── locales/             # Fichiers de support multilingue
├── package.json         # Dépendances du projet
├── vercel.json          # Fichier de configuration Vercel
└── .gitignore           # Fichier Git ignore
```

- `api/telegram.js` : Gère les requêtes webhook de Telegram
- `src/bot.js` : Contient la logique principale du bot et le traitement des commandes
- `src/api.js` : Gère les interactions API avec différents services d'IA
- `src/config.js` : Stocke les configurations du projet et les variables d'environnement
- `src/uploadhandler.js` : Gère la fonctionnalité de téléchargement et d'analyse d'images
- `src/redis.js` : Gère les interactions avec Upstash Redis, utilisé pour stocker l'historique des conversations
- `locales/` : Contient des fichiers de traduction pour différentes langues, prenant en charge la fonctionnalité multilingue

## Démarrage Rapide 🚀

### Prérequis

- Compte [Vercel](https://vercel.com/)
- Compte Telegram et Token de Bot
- Base de données [Upstash](https://upstash.com/) Veuillez sélectionner la base de données Redis et activer la fonctionnalité [Eviction](https://upstash.com/docs/redis/features/eviction)
- Clé API pour au moins un service d'IA

### Étapes de Déploiement

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/snakeying/GPT-Telegram-Bot.git
   cd GPT-Telegram-Bot
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :
   Créez un fichier `.env` et remplissez les informations de configuration nécessaires (référez-vous à la configuration des variables d'environnement ci-dessous).

4. Déployer sur Vercel :
   - Forkez ce dépôt
   - Modifiez selon les instructions en bas du readme
   - Cliquez sur le bouton "Déployer avec Vercel"
   - Connectez votre dépôt GitHub
   - Configurez les variables d'environnement
   - Terminez le déploiement

5. Configurer le Webhook Telegram :
   Après le déploiement, utilisez l'URL suivante pour configurer le Webhook :
   ```
   https://api.telegram.org/bot<VOTRE_TOKEN_BOT>/setWebhook?url=<VOTRE_DOMAINE_VERCEL>/api/telegram
   ```

## Configuration des Variables d'Environnement 🔧

Avant de déployer et d'exécuter GPT-Telegram-Bot, vous devez configurer les variables d'environnement suivantes. Créez un fichier `.env` dans le répertoire racine du projet et configurez les variables suivantes :

| Nom de la Variable | Description | Valeur par Défaut |
|--------------------|-------------|-------------------|
| `OPENAI_API_KEY` | Clé API OpenAI | - |
| `OPENAI_BASE_URL` | URL de base de l'API OpenAI | https://api.openai.com/v1 |
| `OPENAI_MODELS` | Modèles OpenAI à utiliser (séparés par des virgules) | - |
| `DEFAULT_MODEL` | Modèle à utiliser par défaut | Premier modèle dans OPENAI_MODELS |
| `AZURE_OPENAI_API_KEY` | Clé API Azure OpenAI | - |
| `AZURE_OPENAI_ENDPOINT` | Point de terminaison Azure OpenAI | - |
| `AZURE_OPENAI_MODELS` | Modèles Azure OpenAI à utiliser (séparés par des virgules) | - |
| `TELEGRAM_BOT_TOKEN` | Token du Bot Telegram | - |
| `WHITELISTED_USERS` | IDs des utilisateurs autorisés (séparés par des virgules) | - |
| `DALL_E_MODEL` | Modèle DALL-E à utiliser | dall-e-3 |
| `UPSTASH_REDIS_REST_URL` | URL REST Upstash Redis | - |
| `UPSTASH_REST_TOKEN` | Token REST Upstash Redis | - |
| `SYSTEM_INIT_MESSAGE` | Message d'initialisation du système | You are a helpful assistant. |
| `SYSTEM_INIT_MESSAGE_ROLE` | Rôle du message système | system |
| `GEMINI_API_KEY` | Clé API Google Gemini | - |
| `GOOGLE_MODELS` | Modèles Google à utiliser (séparés par des virgules) | - |
| `GEMINI_ENDPOINT` | Point de terminaison de l'API Gemini | https://generativelanguage.googleapis.com/v1beta/models |
| `GROQ_API_KEY` | Clé API Groq | - |
| `GROQ_MODELS` | Modèles Groq à utiliser (séparés par des virgules) | - |
| `MAX_HISTORY_LENGTH` | Longueur maximale de l'historique | 50 |
| `CLAUDE_API_KEY` | Clé API Anthropic Claude | - |
| `CLAUDE_MODELS` | Modèles Claude à utiliser (séparés par des virgules) | - |
| `CLAUDE_ENDPOINT` | Point de terminaison de l'API Claude | https://api.anthropic.com/v1/chat/completions |

Assurez-vous d'ajouter ces variables d'environnement à la configuration de votre projet lors du déploiement sur Vercel ou d'autres plateformes.

## Guide d'Utilisation 📖

- `/start` - Initialiser le bot
- `/new` - Démarrer une nouvelle conversation
- `/history` - Voir l'historique des conversations
- `/help` - Obtenir des informations d'aide
- `/switchmodel <nom du modèle>` - Changer de modèle d'IA
- `/img <description> [taille]` - Générer une image
- `/language <code de langue>` - Changer la langue de l'interface
- Envoyer une image pour l'analyser
- Envoyer un message directement pour converser

Langues prises en charge (utilisez la commande /language) :
- Anglais (en)
- Chinois simplifié (zh-cn)
- Chinois traditionnel (zh-hant)
- Japonais (ja)
- Espagnol (es)
- Français (fr)
- Russe (ru)
- Allemand (de)

## Remarques ⚠️

- Utilisez les quotas API de manière raisonnable, en particulier lors de l'utilisation des fonctionnalités d'image 💸
- Stockez de manière sécurisée les variables d'environnement et les clés API 🔒
- Différents modèles d'IA peuvent avoir des caractéristiques et des limitations différentes 🔄
- Vérifiez et mettez à jour régulièrement les dépendances pour assurer la sécurité et les performances 🔧

## Contribution 🤝

Les Pull Requests ou l'ouverture d'Issues pour améliorer ce projet sont les bienvenues ! Vos contributions rendront cet assistant IA plus puissant et intéressant.

## Licence 📜

Ce projet est sous licence [MIT](https://choosealicense.com/licenses/mit/).

---

À propos du bouton "Déployer avec Vercel" :
Ce bouton fournit une fonction de déploiement en un clic sur Vercel, ce qui est très pratique. Cependant, veuillez noter :

1. Le lien dans le bouton pointe vers le dépôt original (https://github.com/snakeying/GPT-Telegram-Bot).
2. Si vous avez forké ce projet et souhaitez déployer votre propre version, vous devez mettre à jour ce lien de bouton dans le README.
3. Méthode de mise à jour : Remplacez `snakeying/GPT-Telegram-Bot` dans le lien par votre nom d'utilisateur GitHub et le nom du dépôt.

Par exemple, si votre nom d'utilisateur GitHub est "votrenom", vous devriez changer le lien du bouton en :

```markdown
[![Déployer avec Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvotrenom%2FGPT-Telegram-Bot)
```

Cela garantit que le bouton "Déployer avec Vercel" déploiera votre version forkée, et non le dépôt original.
