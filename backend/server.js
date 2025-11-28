const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const { OpenAI } = require('openai')
const dotenv = require('dotenv')
const { SYSTEM_PROMPT } = require('./utils/systemPrompt')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const CHAT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
const TTS_MODEL = process.env.OPENAI_TTS_MODEL || 'gpt-4.1-mini-tts'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

    const assistant = await openai.chat.completions.create({
      model: CHAT_MODEL,
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

app.post('/api/voice', async (req, res) => {
  try {
    const { text, voice = 'alloy' } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' })
    }

    const renderSpeech = async (model) => {
      const speech = await openai.audio.speech.create({
        model,
        voice,
        input: text,
        format: 'mp3'
      })
      const buffer = Buffer.from(await speech.arrayBuffer())
      return buffer.toString('base64')
    }

    let audioBase64
    try {
      audioBase64 = await renderSpeech(TTS_MODEL)
    } catch (ttsError) {
      console.error('Primary TTS model failed', ttsError?.message)
      if (TTS_MODEL !== 'gpt-4o-mini-tts') {
        audioBase64 = await renderSpeech('gpt-4o-mini-tts')
      } else {
        throw ttsError
      }
    }

    res.json({ success: true, audio: audioBase64 })
  } catch (error) {
    console.error('tts error', error?.message)
    res.status(500).json({ error: 'Unable to generate speech right now.' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})
