const messageList = document.getElementById('messageList');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const suggestionButtons = document.querySelectorAll('.suggestion-btn');
const voiceToggle = document.getElementById('voiceToggle');
const listenBtn = document.getElementById('listenBtn');
const featureCards = document.querySelectorAll('.feature-card');
const featureDetail = document.getElementById('featureDetail');

const API_BASE = '/api';
const fallbackResponses = [
  'हमारा सिस्टम आपके डेटा से सीख कर बेहतर सुझाव देगा।',
  'आपके किराना स्टोर को 24/7 आवाज़ से संभाला जा रहा है।',
  'हमारी ROI रिपोर्ट दिखा रही है कि ₹199 हर महीने में 68× रिटर्न है।',
  'आपका व्यवसाय नया हो या पुराना, मैं आपके लिए सही समाधान ढूंढता हूँ।',
  'Voice + text दोनों में मेरी तैयारी पूरी है, बस हमें बताइए कि आपको क्या चाहिए।'
];

const featureCopy = [
  'Telemetry Pulse — Live journey map with neon overlays and high-contrast friction warnings.',
  'Bilingual Voice + Text — Hindi/English trained GPT-4.1 mini, streaming audio plus typed replies.',
  'Insight Nudges — Contextual CTA chips plus ROI numbers derived on every exchange.',
  'Impact Calculator — Shows ₹ savings vs agencies and expected payback in real-time.',
  'Secure Lead Capture — Encrypts responses and bounces structured data to your CRM.',
  'Multi-Channel Embed — Mobile-first widget that scales into a desktop modal instantly.'
];

const appendMessage = (text, isUser = false) => {
  const article = document.createElement('article');
  article.className = isUser ? 'user-bubble' : 'bot-bubble';
  article.innerHTML = `<p>${text}</p><span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
  messageList.appendChild(article);
  messageList.scrollTop = messageList.scrollHeight;
  return article;
};

const setTyping = (isTyping) => {
  let typingBubble = document.querySelector('.typing-bubble');
  if (isTyping) {
    if (!typingBubble) {
      typingBubble = document.createElement('article');
      typingBubble.className = 'bot-bubble typing-bubble';
      typingBubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
      messageList.appendChild(typingBubble);
    }
  } else if (typingBubble) {
    typingBubble.remove();
  }
  messageList.scrollTop = messageList.scrollHeight;
};

const highlightFeature = (index) => {
  featureCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === index);
  });
  if (featureDetail) {
    featureDetail.innerHTML = `
      <p class="detail-title">${featureCards[index].querySelector('.feature-title').textContent}</p>
      <p class="detail-body">${featureCopy[index]}</p>
    `;
  }
};

featureCards.forEach((card, idx) => {
  card.addEventListener('mouseenter', () => highlightFeature(idx));
  card.addEventListener('focus', () => highlightFeature(idx));
  card.addEventListener('click', () => highlightFeature(idx));
});

if (featureCards.length) {
  highlightFeature(0);
}

const synth = window.speechSynthesis;
let recognition;
let recognitionAvailable = false;
let isListening = false;
let activeAudio;
let isSending = false;

const setVoiceButtonState = (state) => {
  if (!voiceToggle) return;
  voiceToggle.dataset.state = state;
  const label = voiceToggle.querySelector('span:last-child');
  if (label) {
    label.textContent = state === 'listening' ? 'Listening…' : 'Voice';
  }
};

const setListenButtonState = (state) => {
  if (!listenBtn) return;
  listenBtn.dataset.state = state;
  const label = listenBtn.querySelector('span:last-child');
  if (label) {
    const map = { idle: 'Listen', loading: 'Loading…', playing: 'Playing…' };
    label.textContent = map[state] || 'Listen';
  }
};

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognitionAvailable = true;
  recognition.lang = 'hi-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => {
    recognitionAvailable = true;
    isListening = true;
    setVoiceButtonState('listening');
  };
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    handleSend(true);
  };
  recognition.onend = () => {
    isListening = false;
    setVoiceButtonState('voice');
  };
  recognition.onerror = () => {
    appendMessage('Voice capture missed, please try again.', false);
    isListening = false;
    setVoiceButtonState('voice');
  };
}

const speak = (text) => {
  if (!synth) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hi-IN';
  utterance.rate = 1;
  synth.speak(utterance);
  return true;
};

const decodeBase64ToAudio = (base64) => {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: 'audio/mpeg' });
};

const playAudioFromText = async (text) => {
  if (!text) return;
  try {
    setListenButtonState('loading');
    const response = await fetch(`${API_BASE}/voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    if (!data.success || !data.audio) {
      throw new Error('No audio payload');
    }

    const audioBlob = decodeBase64ToAudio(data.audio);
    const audioUrl = URL.createObjectURL(audioBlob);
    if (activeAudio) {
      activeAudio.pause();
    }
    activeAudio = new Audio(audioUrl);
    setListenButtonState('playing');
    activeAudio.play();
    activeAudio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      setListenButtonState('idle');
    };
  } catch (error) {
    console.error('TTS playback failed', error);
    const fallbackWorked = speak(text);
    if (!fallbackWorked) {
      appendMessage('Audio playback is unavailable on this device.', false);
    }
    setListenButtonState('idle');
  }
};

const listenLatestBot = () => {
  const botBubbles = messageList.querySelectorAll('.bot-bubble');
  if (!botBubbles.length) return;
  const latestText = botBubbles[botBubbles.length - 1].querySelector('p')?.textContent;
  if (latestText) {
    playAudioFromText(latestText);
  }
};

const sendToAssistant = async (message) => {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context: { surface: 'landing-ui', voiceEnabled: !!recognitionAvailable }
      })
    });

    const data = await response.json();
    if (!data.success || !data.reply) {
      throw new Error('No reply payload');
    }
    return data.reply;
  } catch (error) {
    console.error('Chat request failed', error);
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

const handleSend = async (triggeredByVoice = false) => {
  const message = chatInput.value.trim();
  if (!message || isSending) return;

  appendMessage(message, true);
  chatInput.value = '';
  setTyping(true);
  isSending = true;

  const reply = await sendToAssistant(message, triggeredByVoice);
  setTyping(false);
  isSending = false;

  appendMessage(reply, false);
  playAudioFromText(reply);
};

sendBtn?.addEventListener('click', () => handleSend());

chatInput?.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSend();
  }
});

suggestionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    chatInput.value = button.dataset.suggest;
    handleSend();
  });
});

voiceToggle?.addEventListener('click', () => {
  if (!recognition) {
    appendMessage('Voice capture is not supported in this browser.', false);
    return;
  }
  if (isListening) {
    recognition.stop();
    return;
  }
  recognition.start();
});

listenBtn?.addEventListener('click', () => {
  listenLatestBot();
});

setVoiceButtonState('voice');
setListenButtonState('idle');
