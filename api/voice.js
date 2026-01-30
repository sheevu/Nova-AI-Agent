const { OpenAI } = require('openai');

const PRIMARY_TTS_MODEL = process.env.OPENAI_TTS_MODEL || 'gpt-4.1-mini-tts';
const FALLBACK_TTS_MODEL = 'gpt-4o-mini-tts';

const renderSpeech = async ({ openai, model, voice, text }) => {
  const speech = await openai.audio.speech.create({
    model,
    voice,
    input: text,
    format: 'mp3'
  });
  const buffer = Buffer.from(await speech.arrayBuffer());
  return buffer.toString('base64');
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice = 'alloy' } = req.body || {};

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let audioBase64;
    try {
      audioBase64 = await renderSpeech({
        openai,
        model: PRIMARY_TTS_MODEL,
        voice,
        text
      });
    } catch (ttsError) {
      console.error('Primary TTS model failed', ttsError?.message);
      if (PRIMARY_TTS_MODEL !== FALLBACK_TTS_MODEL) {
        audioBase64 = await renderSpeech({
          openai,
          model: FALLBACK_TTS_MODEL,
          voice,
          text
        });
      } else {
        throw ttsError;
      }
    }

    res.status(200).json({ success: true, audio: audioBase64 });
  } catch (error) {
    console.error('tts error', error?.message);
    res.status(500).json({ error: 'Unable to generate speech right now.' });
  }
};
