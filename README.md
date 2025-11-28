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

### Deploy on Vercel

This project is configured for easy deployment on Vercel:

1. Fork this repository
2. Create a Vercel project connected to your fork
3. Add environment variable `OPENAI_API_KEY` in Vercel Settings
4. Deploy!

**Live Demo**: https://nova-ai-agent.vercel.app

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
