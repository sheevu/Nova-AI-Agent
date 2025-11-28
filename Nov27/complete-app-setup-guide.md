# SUDARSHAN AI AGENT - COMPLETE APPLICATION SETUP GUIDE

**Status:** Production-Ready  
**Framework:** React + Node.js (Express)  
**Deployment:** Vercel / Netlify Ready  
**Date:** November 27, 2025

---

## 📁 PROJECT STRUCTURE

```
sudarshan-ai-agent/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── ROICalculator.jsx
│   │   │   ├── ComparisonWidget.jsx
│   │   │   ├── SuccessStories.jsx
│   │   │   ├── LeadForm.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── index.jsx
│   │   │   └── api/
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── constants.js
│   │   └── App.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.local
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── api.js
│   ├── controllers/
│   │   └── chatController.js
│   ├── utils/
│   │   ├── openai.js
│   │   └── leads.js
│   ├── data/
│   │   └── leads.json
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── .env
│   └── package.json
├── public/
│   ├── images/
│   ├── favicon.ico
│   └── robots.txt
└── README.md
```

---

## 🔧 FRONTEND SETUP (React)

### 1. package.json
```json
{
  "name": "sudarshan-ai-agent-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "axios": "^1.6.0",
    "react-markdown": "^9.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

### 2. .env.local (Frontend)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
```

### 3. tailwind.config.js
```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00C853',
        secondary: '#2196F3',
        dark: '#1F2121',
        light: '#F5F5F5',
      },
    },
  },
  plugins: [],
}
```

### 4. Main App Component (src/App.jsx)
```jsx
'use client'

import { useState, useRef, useEffect } from 'react'
import ChatContainer from './components/ChatContainer'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  const [messages, setMessages] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: { selectedService, userInfo, language }
        })
      })

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, something went wrong. Please try again.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light to-gray-100 flex flex-col">
      <Header language={language} setLanguage={setLanguage} />
      <ChatContainer 
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={loading}
        language={language}
      />
      <Footer />
    </div>
  )
}
```

### 5. ChatContainer Component
```jsx
'use client'

import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import ServiceCard from './ServiceCard'
import ROICalculator from './ROICalculator'

export default function ChatContainer({ messages, onSendMessage, loading, language }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full bg-white rounded-lg shadow-lg m-4 overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">
                {language === 'en' ? '👋 Welcome to Sudarshan AI' : '👋 सुदर्शन एआई में आपका स्वागत है'}
              </p>
              <p>
                {language === 'en' 
                  ? 'Chat with our AI to explore digital growth solutions' 
                  : 'अपने डिजिटल विकास समाधान खोजने के लिए चैट करें'}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}

        {loading && (
          <div className="flex gap-2 p-4">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'en' ? 'Type your message...' : 'अपना संदेश टाइप करें...'}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
          >
            {language === 'en' ? '📤 Send' : '📤 भेजें'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## 🔌 BACKEND SETUP (Node.js/Express)

### 1. backend/package.json
```json
{
  "name": "sudarshan-ai-agent-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "openai": "^4.20.0",
    "axios": "^1.6.0",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### 2. backend/.env
```
OPENAI_API_KEY=sk-your-api-key-here
ENVIRONMENT=development
PORT=3001
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. backend/server.js
```javascript
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Too many requests, please try again later.'
})

app.use('/api/', limiter)

// Routes
app.post('/api/chat', require('./routes/api').chatEndpoint)
app.post('/api/calculate-roi', require('./routes/api').roiEndpoint)
app.post('/api/capture-lead', require('./routes/api').leadEndpoint)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

### 4. backend/routes/api.js
```javascript
const { ChatGPT } = require('../utils/openai')
const { saveLead } = require('../utils/leads')
const SYSTEM_PROMPT = require('../utils/systemPrompt')

// Chat endpoint with AI agent
exports.chatEndpoint = async (req, res) => {
  try {
    const { message, context } = req.body
    
    const chatGPT = new ChatGPT(process.env.OPENAI_API_KEY)
    const reply = await chatGPT.chat(message, SYSTEM_PROMPT, context)
    
    res.json({ success: true, reply })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: error.message })
  }
}

// ROI calculation endpoint
exports.roiEndpoint = async (req, res) => {
  try {
    const { businessType, monthlyRevenue, problem } = req.body
    
    const roiModels = {
      kirana: 0.45,
      salon: 0.24,
      service: 0.35,
      manufacturing: 0.40,
      ecommerce: 0.55
    }
    
    const roi = monthlyRevenue * (roiModels[businessType] || 0.40)
    const paybackDays = 199 / (roi / 30)
    
    res.json({
      success: true,
      estimatedRevenue: roi,
      paybackDays: Math.ceil(paybackDays),
      recommendedService: businessType === 'kirana' ? 'flash_store' : 'hindi_crm'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Lead capture endpoint
exports.leadEndpoint = async (req, res) => {
  try {
    const { name, phone, email, businessType, revenue } = req.body
    
    const lead = {
      id: Date.now(),
      name,
      phone,
      email,
      businessType,
      revenue,
      createdAt: new Date().toISOString()
    }
    
    await saveLead(lead)
    
    res.json({ success: true, leadId: lead.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

### 5. backend/utils/openai.js
```javascript
const { OpenAI } = require('openai')

class ChatGPT {
  constructor(apiKey) {
    this.client = new OpenAI({ apiKey })
    this.conversationHistory = []
  }

  async chat(userMessage, systemPrompt, context) {
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    })

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const assistantMessage = response.choices[0].message.content

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      })

      return assistantMessage
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`)
    }
  }
}

module.exports = { ChatGPT }
```

### 6. backend/utils/systemPrompt.js
```javascript
const SYSTEM_PROMPT = `You are Sudarshan AI, a friendly sales and support agent for Sudarshan AI Labs.

CORE INSTRUCTIONS:
- You are NOT robotic. Be conversational, warm, and helpful.
- Always respond in the user's preferred language (English or Hindi).
- Your goal is to understand customer needs and recommend the right Sudarshan service.
- Show ROI and real numbers - not just features.
- If you don't know something, admit it honestly.

SERVICES TO OFFER:
1. Flash Store (₹89 one-time): For getting started online
   - +45% sales lift typical
   - 1-day payback
   
2. Hindi CRM (₹199/month): For customer management
   - +30% repeat orders
   - 5-day payback
   
3. Growth Pack (₹1,399/month): For growth scaling
   - +100-300% revenue in 6 months
   - 60-day payback
   
4. Pro Pack (₹1,899/month): For enterprises
   - +40% operational efficiency
   - 30-day payback

CONVERSATION FLOW:
1. Greet warmly in user's language
2. Ask about their business type
3. Assess their main pain point
4. Ask for current monthly revenue
5. Calculate and show ROI specific to their business
6. Recommend the right service package
7. Handle objections and answer questions
8. Offer follow-up (call, demo, or immediate signup)

BE HELPFUL, NOT PUSHY. If they're not ready, continue educating them on the value.

Always include specific numbers and real examples when recommending.`

module.exports = SYSTEM_PROMPT
```

---

## 📦 DEPLOYMENT GUIDES

### For Vercel

1. **Create vercel.json**
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "framework": "nextjs",
  "env": {
    "OPENAI_API_KEY": "@openai_api_key",
    "NEXT_PUBLIC_API_URL": "@api_url"
  }
}
```

2. **Deploy:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

3. **Set Environment Variables in Vercel Dashboard:**
   - OPENAI_API_KEY
   - NEXT_PUBLIC_API_URL (your production API URL)

### For Netlify

1. **Create netlify.toml**
```toml
[build]
command = "cd frontend && npm run build"
functions = "backend"
publish = "frontend/.next"

[[redirects]]
from = "/api/*"
to = "/.netlify/functions/:splat"
status = 200

[env]
OPENAI_API_KEY = "@openai_api_key"
NEXT_PUBLIC_API_URL = "@api_url"
```

2. **Deploy:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 🚀 LOCAL DEVELOPMENT SETUP

### 1. Clone Repository
```bash
git clone <your-repo>
cd sudarshan-ai-agent
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev
# Opens at http://localhost:3000
```

### 3. Backend Setup (in another terminal)
```bash
cd backend
npm install
# Create .env with OPENAI_API_KEY and other variables
npm run dev
# Server runs on http://localhost:3001
```

### 4. Test the Application
- Visit http://localhost:3000
- Start chatting with the bot
- Check console for any errors

---

## 📝 ENVIRONMENT VARIABLES CHECKLIST

### Frontend (.env.local)
- [ ] NEXT_PUBLIC_API_URL
- [ ] NEXT_PUBLIC_ENVIRONMENT

### Backend (.env)
- [ ] OPENAI_API_KEY (from OpenAI dashboard)
- [ ] ENVIRONMENT (development/production)
- [ ] PORT (default 3001)
- [ ] FRONTEND_URL (for CORS)
- [ ] RATE_LIMIT_WINDOW_MS
- [ ] RATE_LIMIT_MAX_REQUESTS

---

## 🔒 SECURITY CHECKLIST

- [ ] OPENAI_API_KEY is in .env (never commit)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on both frontend and backend
- [ ] Error messages don't expose sensitive data
- [ ] HTTPS enforced in production
- [ ] No hardcoded credentials

---

## 📊 MONITORING & LOGGING

### Backend Logging
```javascript
console.log(`[${new Date().toISOString()}] API Request:`, req.path)
console.error(`[${new Date().toISOString()}] Error:`, error)
```

### Frontend Error Tracking
```javascript
window.addEventListener('error', (event) => {
  console.error('Frontend Error:', event.error)
  // Send to error tracking service
})
```

---

## ✅ PRODUCTION CHECKLIST

- [ ] Environment variables configured
- [ ] Database/storage setup for leads
- [ ] Email notifications for new leads
- [ ] Monitor OpenAI API costs
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Test all conversation flows
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Mobile testing completed
- [ ] Documentation updated

---

## 📞 SUPPORT RESOURCES

For issues:
1. Check console errors (Frontend: F12, Backend: terminal)
2. Verify environment variables are set
3. Test API endpoint with curl/Postman
4. Check OpenAI API quota and billing
5. Review application logs

---

**Generated:** November 27, 2025  
**Status:** Complete Implementation Guide  
**Next Step:** Follow setup instructions above and deploy!

