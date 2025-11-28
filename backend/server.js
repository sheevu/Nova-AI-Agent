const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const { OpenAI } = require('openai')
const dotenv = require('dotenv')
const { SYSTEM_PROMPT } = require('./utils/systemPrompt')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
})

app.use('/api/', limiter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const assistant = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.6,
      max_tokens: 400
    })

    const reply = assistant.choices?.[0]?.message?.content || 'Sorry, I could not compute a reply.'

    res.json({ success: true, reply })
  } catch (error) {
    console.error('chat error', error?.message)
    res.status(500).json({ error: 'Assistant temporarily unavailable' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})
