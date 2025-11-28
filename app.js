const messageList = document.getElementById('messageList');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const suggestionButtons = document.querySelectorAll('.suggestion-btn');
const voiceToggle = document.getElementById('voiceToggle');
const listenBtn = document.getElementById('listenBtn');
const serviceTrack = document.getElementById('serviceTrack');
const pricingTrack = document.getElementById('pricingTrack');

const API_BASE = '/api';
const fallbackResponses = [
  'मैं आपकी ज़रूरत समझकर सही पैकेज सुझाऊँगा — पहले अपना बिज़नेस, नाम और लोकेशन बताइए।',
  '₹89 सेटअप और मुफ़्त Udyam रजिस्ट्रेशन के साथ हम आपको ऑनलाइन लॉन्च कर देंगे।',
  'व्हाट्सऐप, वेबसाइट और गूगल लिस्टिंग—सबकुछ एक ही जगह से संभालेंगे। आप किस शहर से हैं?',
  'AI voice + text दोनों तैयार हैं। आपसे जुड़कर एक मिनी प्लान साझा करूँ?',
  'आपके लिए ROI दिखाते हुए अगला सबसे अच्छा कदम बताऊँगा—बस उद्योग और बजट बताइए।'
];

const services = [
  {
    title: 'Growth Launchpad',
    body: '₹89 में WhatsApp + Google Business + Insta hooks, दिन में 5 लीड्स के लिए तैयार।',
    badge: 'Starter',
    accent: '#7ed957',
    gradient: 'linear-gradient(135deg, rgba(126,217,87,0.2), rgba(77,198,255,0.18))'
  },
  {
    title: 'Bilingual Voice Desk',
    body: 'Hindi/English voice + text replies (GPT-4.1 mini) 24/7, CTA nudges और CRM-ready।',
    badge: 'Voice AI',
    accent: '#9b8cff',
    gradient: 'linear-gradient(135deg, rgba(155,140,255,0.28), rgba(34,193,195,0.16))'
  },
  {
    title: 'Lead Capture Pro',
    body: 'Encrypted form + OTP qualify, auto-routing to HubSpot/Sheets के साथ conversion guardrails।',
    badge: 'Secure',
    accent: '#ff9f6b',
    gradient: 'linear-gradient(135deg, rgba(255,159,107,0.28), rgba(255,255,255,0.06))'
  },
  {
    title: 'Insight Overlays',
    body: 'हर उत्तर में ROI, payback और अगला CTA—ताकि बातचीत तुरंत action में बदले।',
    badge: 'Impact',
    accent: '#5ce1e6',
    gradient: 'linear-gradient(135deg, rgba(92,225,230,0.3), rgba(10,12,24,0.6))'
  },
  {
    title: 'Campaign Jumpstart',
    body: 'Mini campaigns + schema-ready hooks, organic + paid दोनों के लिए fast creative spins।',
    badge: 'Ads + SEO',
    accent: '#ffd76f',
    gradient: 'linear-gradient(135deg, rgba(255,215,111,0.3), rgba(92,108,255,0.22))'
  },
  {
    title: 'Multi-Channel Embed',
    body: 'Mobile widget to desktop modal—ज़ैपियर-ready actions और WhatsApp handoff in a tap.',
    badge: 'Omni',
    accent: '#7ed957',
    gradient: 'linear-gradient(135deg, rgba(126,217,87,0.26), rgba(255,255,255,0.05))'
  }
];

const pricingPlans = [
  {
    name: 'Starter Sprint',
    price: '₹89 setup',
    desc: '1 WhatsApp bot, Google Business listing, और Insta hooks—launch in 24 hours.',
    highlight: 'Best for quick validation',
    accent: '#7ed957'
  },
  {
    name: 'Growth Plus',
    price: '₹1499/mo',
    desc: 'Voice desk + lead capture + CRM sync. ROI nudges in every reply.',
    highlight: 'Most popular',
    accent: '#9b8cff'
  },
  {
    name: 'Omni Prime',
    price: '₹2499/mo',
    desc: 'Multi-channel embeds, campaign jumpstarts, और weekly insight overlays.',
    highlight: 'Scale confidently',
    accent: '#ff9f6b'
  },
  {
    name: 'Enterprise Care',
    price: 'Custom',
    desc: 'SLAs, advanced routing, compliance reviews, और dedicated success pod.',
    highlight: 'For regulated teams',
    accent: '#5ce1e6'
  }
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

let serviceCards = [];
let serviceCursor = 0;
let serviceInterval;
let lastFallbackIndex = -1;
let pricingCards = [];
let pricingCursor = 0;
let pricingInterval;
let lastBotReply = '';

const getVisibleCount = () => {
  if (window.innerWidth > 1180) return 5;
  if (window.innerWidth > 980) return 4;
  return 3;
};

const getPricingVisibleCount = () => {
  if (window.innerWidth > 1180) return 3;
  if (window.innerWidth > 720) return 2;
  return 1;
};

const chooseFallback = () => {
  let idx = Math.floor(Math.random() * fallbackResponses.length);
  if (idx === lastFallbackIndex && fallbackResponses.length > 1) {
    idx = (idx + 1) % fallbackResponses.length;
  }
  lastFallbackIndex = idx;
  return fallbackResponses[idx];
};

const buildServices = () => {
  if (!serviceTrack) return;
  serviceTrack.innerHTML = '';
  serviceCards = services.map((service, idx) => {
    const card = document.createElement('article');
    card.className = 'service-card';
    card.setAttribute('role', 'listitem');
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="service-card__badge" style="color:${service.accent}; border-color:${service.accent};">${service.badge}</div>
      <h3>${service.title}</h3>
      <p>${service.body}</p>
    `;
    card.style.backgroundImage = service.gradient;
    card.dataset.index = idx;
    card.addEventListener('mouseenter', () => {
      serviceCursor = idx;
      renderServices(true);
    });
    card.addEventListener('focus', () => {
      serviceCursor = idx;
      renderServices(true);
    });
    card.addEventListener('click', () => {
      serviceCursor = idx;
      renderServices(true);
      startServiceRotation();
    });
    serviceTrack.appendChild(card);
    return card;
  });
  renderServices(true);
  startServiceRotation();
};

const buildPricing = () => {
  if (!pricingTrack) return;
  pricingTrack.innerHTML = '';
  pricingCards = pricingPlans.map((plan, idx) => {
    const card = document.createElement('article');
    card.className = 'pricing-card';
    card.setAttribute('role', 'listitem');
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="pricing-chip" style="color:${plan.accent}; border-color:${plan.accent};">${plan.highlight}</div>
      <h3>${plan.name}</h3>
      <p class="pricing-price">${plan.price}</p>
      <p class="pricing-body">${plan.desc}</p>
    `;
    card.dataset.index = idx;
    card.addEventListener('mouseenter', () => {
      pricingCursor = idx;
      renderPricing(true);
    });
    card.addEventListener('focus', () => {
      pricingCursor = idx;
      renderPricing(true);
    });
    pricingTrack.appendChild(card);
    return card;
  });
  renderPricing(true);
  startPricingRotation();
};

const renderServices = (immediate = false) => {
  if (!serviceCards.length) return;
  const count = getVisibleCount();
  const visibleCards = serviceCards.filter((card) => card.classList.contains('visible'));

  if (!immediate) {
    visibleCards.forEach((card) => {
      card.classList.add('exit');
      setTimeout(() => card.classList.remove('visible', 'exit'), 260);
    });
  } else {
    visibleCards.forEach((card) => card.classList.remove('visible', 'exit'));
  }

  setTimeout(() => {
    for (let i = 0; i < count; i += 1) {
      const card = serviceCards[(serviceCursor + i) % serviceCards.length];
      card.classList.add('visible', 'enter');
      setTimeout(() => card.classList.remove('enter'), 320);
    }
  }, immediate ? 0 : 180);
};

const renderPricing = (immediate = false) => {
  if (!pricingCards.length) return;
  const count = getPricingVisibleCount();
  const visibleCards = pricingCards.filter((card) => card.classList.contains('visible'));

  if (!immediate) {
    visibleCards.forEach((card) => {
      card.classList.add('exit');
      setTimeout(() => card.classList.remove('visible', 'exit'), 260);
    });
  } else {
    visibleCards.forEach((card) => card.classList.remove('visible', 'exit'));
  }

  setTimeout(() => {
    for (let i = 0; i < count; i += 1) {
      const card = pricingCards[(pricingCursor + i) % pricingCards.length];
      card.classList.add('visible', 'enter');
      setTimeout(() => card.classList.remove('enter'), 320);
    }
  }, immediate ? 0 : 180);
};

const startServiceRotation = () => {
  if (serviceInterval) clearInterval(serviceInterval);
  serviceInterval = setInterval(() => {
    const count = getVisibleCount();
    serviceCursor = (serviceCursor + count) % serviceCards.length;
    renderServices();
  }, 5000);
};

const startPricingRotation = () => {
  if (pricingInterval) clearInterval(pricingInterval);
  pricingInterval = setInterval(() => {
    const count = getPricingVisibleCount();
    pricingCursor = (pricingCursor + count) % pricingCards.length;
    renderPricing();
  }, 5000);
};

window.addEventListener('resize', () => {
  renderServices(true);
  startServiceRotation();
  renderPricing(true);
  startPricingRotation();
});

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
    return chooseFallback();
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

  let safeReply = reply?.trim() || chooseFallback();
  if (safeReply.toLowerCase() === lastBotReply.toLowerCase()) {
    const alternate = chooseFallback();
    safeReply = alternate;
  }
  lastBotReply = safeReply;

  appendMessage(safeReply, false);
  playAudioFromText(safeReply);
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

if (serviceTrack) {
  buildServices();
  serviceTrack.addEventListener('mouseenter', () => clearInterval(serviceInterval));
  serviceTrack.addEventListener('mouseleave', startServiceRotation);
}

if (pricingTrack) {
  buildPricing();
  pricingTrack.addEventListener('mouseenter', () => clearInterval(pricingInterval));
  pricingTrack.addEventListener('mouseleave', startPricingRotation);
}
