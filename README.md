# 🚀 Nova-AI-Agent: Sudarshan AI Sales & Support Agent

**कुशल विक्रय सहायक** - Intelligent Sales & Support AI Agent in Hindi & English

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)](https://nova-ai-agent.vercel.app)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Overview

Nova-AI-Agent is an advanced AI-powered sales and support agent built by **Sudarshan AI Labs**. It provides bilingual (Hindi/English) support with voice and text capabilities, powered by OpenAI's GPT-4 API.

### ✨ Key Features

- **Bilingual Support**: Seamless Hindi & English conversations
- **Voice & Text**: Support for both voice input/output and typed messages
- **Real-time Streaming**: Live AI responses with streaming capabilities
- **Rate Limiting**: Built-in API rate limiting (30 requests/minute)
- **CORS Enabled**: Cross-origin resource sharing for frontend integration
- **Telemetry**: Real-time journey tracking and analytics
- **Impact Calculator**: ROI metrics and performance analytics
- **Secure**: Environment-based configuration with .env support
- **Interactive UI**: Neon service carousel plus animated pricing slider tuned for mobile and auto-rotating insights
- **Voice-ready Copy**: Greeting and fallback responses avoid repetition while guiding users to share business details

## 🏗️ Project Structure

```
Nova-AI-Agent/
├── frontend/
│   ├── index.html         # Main HTML interface
│   ├── app.js             # Frontend logic & interactions
│   └── styles.css         # UI styling
├── backend/
│   ├── server.js          # Express backend server
│   ├── package.json       # Backend dependencies
│   └── utils/
│       └── systemPrompt.js # AI system prompt configuration
├── vercel.json            # Vercel deployment config
├── package.json           # Root package config
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/sheevu/Nova-AI-Agent.git
cd Nova-AI-Agent

# Install dependencies
npm install
cd backend && npm install && cd ..
```

### Environment Setup

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
# Optional: override models
OPENAI_MODEL=gpt-4.1-mini
OPENAI_TTS_MODEL=gpt-4.1-mini-tts
```

### Running Locally

```bash
# Start backend server
cd backend
npm run dev

# In another terminal, start frontend
cd ..
npm run dev
```

Access the application at `http://localhost:4173`

### Testing

```bash
npm run build
```

This static prototype uses the build command above to verify that dependencies install and assets bundle successfully.

## 📦 Deployment

You can ship the frontend + voice-enabled API from GitHub to either **Vercel** or **Netlify**.

### Deploy on Vercel (serverless, all-in-one)

This repo already includes `vercel.json` and the backend API routes, so deployment is turnkey:

1. Fork this repository
2. Create a Vercel project connected to your fork
3. Add environment variable `OPENAI_API_KEY` in Vercel Settings (plus optional `OPENAI_MODEL`, `OPENAI_TTS_MODEL`)
4. Deploy — both `/api/chat` and `/api/voice` will run as serverless functions

**Live Demo**: https://nova-ai-agent.vercel.app

### Deploy on Netlify (static UI + Netlify Functions)

Netlify can also host the same UI and AI voice backend from GitHub:

1. **Fork & import**: Import your fork into Netlify as a new site, keeping the build command `npm run build` and publish directory `.` (root).
2. **Environment variables**: Add `OPENAI_API_KEY` (and optional `OPENAI_MODEL`, `OPENAI_TTS_MODEL`) under **Site settings → Environment** so chat + voice stay enabled.
3. **Serverless API**: Move `backend/server.js` into a Netlify Function (e.g., `netlify/functions/api.js`) using an Express adapter like `serverless-http`, or proxy your own Node host at `/api/*`. The existing `/api/chat` and `/api/voice` routes work unchanged once mounted in that function.
4. **Local verify**: Run `npm run dev` for the frontend and your Netlify Function with `netlify dev` to confirm voice playback before publishing.

If you prefer to avoid a functions rewrite, you can deploy the static frontend to Netlify and point `/api/chat` + `/api/voice` to any Node host running `backend/server.js` (set the base URL in `app.js`).

## 🔧 API Endpoints

### Health Check
```
GET /api/health
```

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "message": "Your question here",
  "context": {}
}
```

**Response**:
```json
{
  "success": true,
  "reply": "AI generated response"
}
```

### Voice Endpoint (ChatGPT 4.1 mini TTS)
```
POST /api/voice
Content-Type: application/json

{
  "text": "What should I play as audio?",
  "voice": "alloy" // optional
}
```

**Response**: `{ "success": true, "audio": "<base64-mp3>" }`

## 📊 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT-4.1 mini (chat + voice TTS)
- **Deployment**: Vercel (Serverless)
- **Rate Limiting**: express-rate-limit
- **CORS**: cors middleware

## 📝 Configuration

### Vercel Configuration (vercel.json)
```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": ".",
  "installCommand": "npm install",
  "env": {
    "OPENAI_API_KEY": "@OPENAI_API_KEY"
  }
}
```

## 🔐 Security

- API keys are managed through environment variables
- Rate limiting prevents abuse
- CORS is properly configured
- No sensitive data in version control

## 📈 Performance

- **Response Time**: < 2 seconds average
- **Rate Limit**: 30 requests/minute per IP
- **Concurrency**: Handles multiple simultaneous conversations
- **Uptime**: 99.9% SLA on Vercel

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

- **Sheevum Goel** (@sheevu) - Founder, Sudarshan AI Labs
- **Sheev** (@sheev) - Contributor

## 🙌 Acknowledgments

- OpenAI for GPT-4 API
- Vercel for seamless deployment
- The open-source community

## 📞 Support

For support, issues, or questions:
- Open an issue on GitHub
- Visit: https://sudarshanailabs.com
- Contact: team@sudarshanailabs.com

---

**Built with ❤️ by Sudarshan AI Labs**

*Empowering businesses with AI-driven sales & support solutions*
