const { OpenAI } = require('openai');
const { SYSTEM_PROMPT } = require('../backend/utils/systemPrompt');

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
    const { message, context = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    const assistant = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.6,
      max_tokens: 400
    });

    const reply = assistant.choices?.[0]?.message?.content || 'Sorry, I could not compute a reply.';
    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error('chat error', error?.message);
    res.status(500).json({ error: 'Assistant temporarily unavailable' });
  }
};
