# SUDARSHAN AI AGENT - REACT COMPONENTS CODE

**Generated:** November 27, 2025  
**Ready to Copy-Paste into Your Project**

---

## 📄 File: src/components/ChatContainer.jsx

```jsx
'use client'
import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatContainer({ messages, onSendMessage, loading, language }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full bg-white rounded-lg shadow-lg m-4 overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-600">
              <div className="text-5xl mb-4">👋</div>
              <p className="text-lg font-semibold mb-2">
                {language === 'en' ? 'Welcome to Sudarshan AI' : 'सुदर्शन एआई में आपका स्वागत है'}
              </p>
              <p className="text-sm">
                {language === 'en' 
                  ? 'Let\'s explore digital growth solutions for your business' 
                  : 'अपने व्यापार के लिए डिजिटल समाधान खोजें'}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}

        {loading && (
          <div className="flex gap-2 p-4 justify-start">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'en' ? 'Type your message...' : 'अपना संदेश लिखें...'}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all font-semibold"
          >
            {loading ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## 📄 File: src/components/MessageBubble.jsx

```jsx
export default function MessageBubble({ message }) {
  const isBot = message.role === 'assistant'

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-in fade-in slide-in-from-bottom-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isBot
            ? 'bg-gray-200 text-gray-900'
            : 'bg-blue-500 text-white'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span className={`text-xs mt-1 block ${isBot ? 'text-gray-600' : 'text-blue-100'}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
```

---

## 📄 File: src/components/ServiceCard.jsx

```jsx
export default function ServiceCard({ service, language, onSelect }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
        <span className="text-2xl">{service.emoji}</span>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-green-600">
          {service.currency}{service.price}
          <span className="text-sm text-gray-600">/{service.billing_type}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">✅ {language === 'en' ? 'Includes:' : 'शामिल हैं:'}</h4>
        <ul className="space-y-1">
          {service.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="text-sm text-gray-700">✓ {feature}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800 font-semibold">
          📈 {service.roi_estimate}
        </p>
        <p className="text-xs text-green-700">
          ⏱️ {language === 'en' ? 'Payback:' : 'वापसी:'} {service.payback_days} {language === 'en' ? 'days' : 'दिन'}
        </p>
      </div>

      <button
        onClick={() => onSelect(service.id)}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
      >
        {language === 'en' ? '🚀 Get Started' : '🚀 शुरू करें'}
      </button>
    </div>
  )
}
```

---

## 📄 File: src/components/ROICalculator.jsx

```jsx
'use client'
import { useState } from 'react'

export default function ROICalculator({ language }) {
  const [revenue, setRevenue] = useState(30000)
  const [businessType, setBusinessType] = useState('kirana')

  const roiModels = {
    kirana: 0.45,
    salon: 0.24,
    service: 0.35,
    manufacturing: 0.40,
    ecommerce: 0.55
  }

  const estimatedIncome = revenue * (roiModels[businessType] || 0.40)
  const paybackDays = Math.ceil(199 / (estimatedIncome / 30))

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6 my-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {language === 'en' ? '📊 Your ROI Calculation' : '📊 आपकी आरओआई गणना'}
      </h3>

      <div className="space-y-4">
        {/* Business Type Selector */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            {language === 'en' ? 'Business Type:' : 'व्यापार प्रकार:'}
          </label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="kirana">📦 {language === 'en' ? 'Kirana/Retail' : 'किराना दुकान'}</option>
            <option value="salon">💇 {language === 'en' ? 'Salon & Beauty' : 'सैलून'}</option>
            <option value="service">🔧 {language === 'en' ? 'Service Center' : 'सर्विस सेंटर'}</option>
            <option value="manufacturing">🏭 {language === 'en' ? 'Manufacturing' : 'विनिर्माण'}</option>
            <option value="ecommerce">📱 {language === 'en' ? 'E-commerce' : 'ई-कॉमर्स'}</option>
          </select>
        </div>

        {/* Revenue Slider */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            {language === 'en' ? 'Monthly Revenue:' : 'मासिक राजस्व:'} ₹{revenue.toLocaleString()}
          </label>
          <input
            type="range"
            min="5000"
            max="500000"
            value={revenue}
            onChange={(e) => setRevenue(parseInt(e.target.value))}
            className="w-full mt-2 h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>₹5k</span>
            <span>₹500k</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg p-4 space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">
              {language === 'en' ? 'Estimated Additional Income:' : 'अनुमानित अतिरिक्त आय:'}
            </span>
            <span className="text-2xl font-bold text-green-600">
              ₹{Math.round(estimatedIncome).toLocaleString()}/mo
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">
              {language === 'en' ? 'Payback Period:' : 'वापसी अवधि:'}
            </span>
            <span className="text-lg font-bold text-green-600">
              {paybackDays} {language === 'en' ? 'days' : 'दिन'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">
              {language === 'en' ? '90-Day Benefit:' : '90 दिन का लाभ:'}
            </span>
            <span className="text-lg font-bold text-green-600">
              ₹{Math.round(estimatedIncome * 3).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 📄 File: src/components/ComparisonWidget.jsx

```jsx
export default function ComparisonWidget({ language }) {
  const comparisons = [
    { name: language === 'en' ? 'Traditional Agency' : 'ट्रेडिशनल एजेंसी', cost: 5000, hindi: false, auto: false },
    { name: language === 'en' ? 'DIY (Your Time)' : 'DIY (आपका समय)', cost: 15000, hindi: false, auto: false },
    { name: 'Sudarshan', cost: 199, hindi: true, auto: true }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 my-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {language === 'en' ? '💰 Cost Comparison' : '💰 लागत तुलना'}
      </h3>

      <div className="space-y-4">
        {comparisons.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">
                ₹{item.cost.toLocaleString()}/month
              </p>
            </div>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.name === 'Sudarshan' ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min((item.cost / 15000) * 100, 100)}%` }}
              ></div>
            </div>
            <span className={`text-sm font-bold ${item.name === 'Sudarshan' ? 'text-green-600' : 'text-gray-600'}`}>
              {item.hindi && item.auto ? '✅ Best' : '-'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-900">
          <strong>💚 {language === 'en' ? 'Save ₹4,801/month' : '₹4,801/माह बचाएं'}</strong>
          <br />
          <span className="text-xs text-green-800">
            {language === 'en' 
              ? 'vs traditional agencies. 96% cheaper!'
              : 'पारंपरिक एजेंसियों की तुलना में 96% सस्ता!'}
          </span>
        </p>
      </div>
    </div>
  )
}
```

---

## 📄 File: src/components/Header.jsx

```jsx
export default function Header({ language, setLanguage }) {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-lg">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h1 className="font-bold text-xl">Sudarshan AI</h1>
            <p className="text-xs opacity-90">{language === 'en' ? 'Digital Growth Partner' : 'डिजिटल विकास साथी'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          <span className="text-xs">{language === 'en' ? 'Online' : 'ऑनलाइन'}</span>
          
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="ml-4 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-sm font-semibold transition-all"
          >
            {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
          </button>
        </div>
      </div>
    </header>
  )
}
```

---

## 📄 File: src/components/Footer.jsx

```jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-4 text-xs">
      <p>
        🔒 Secure | 💬 Powered by Sudarshan AI | 
        <a href="#" className="text-green-400 hover:text-green-300"> Privacy Policy</a>
      </p>
    </footer>
  )
}
```

---

## 📄 File: src/components/LeadForm.jsx

```jsx
'use client'
import { useState } from 'react'

export default function LeadForm({ language, onSubmit }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
    setForm({ name: '', phone: '', email: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-green-200 rounded-lg p-4 my-4">
      <h3 className="font-bold text-gray-900 mb-3">
        {language === 'en' ? '📝 Get Your Personalized Quote' : '📝 अपना व्यक्तिगत उद्धरण प्राप्त करें'}
      </h3>

      <input
        type="text"
        placeholder={language === 'en' ? 'Your Name' : 'आपका नाम'}
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value})}
        className="w-full px-3 py-2 border rounded mb-2 text-sm"
        required
      />

      <input
        type="tel"
        placeholder={language === 'en' ? 'Phone Number' : 'फोन नंबर'}
        value={form.phone}
        onChange={(e) => setForm({...form, phone: e.target.value})}
        className="w-full px-3 py-2 border rounded mb-2 text-sm"
        required
      />

      <input
        type="email"
        placeholder={language === 'en' ? 'Email Address' : 'ईमेल पता'}
        value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
        className="w-full px-3 py-2 border rounded mb-3 text-sm"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition-colors text-sm"
      >
        {language === 'en' ? '✅ Send My Quote' : '✅ मुझे उद्धरण भेजें'}
      </button>
    </form>
  )
}
```

---

## 📄 File: backend/utils/leads.js

```javascript
const fs = require('fs').promises
const path = require('path')

const LEADS_FILE = path.join(__dirname, '../data/leads.json')

async function saveLead(lead) {
  try {
    let leads = []
    try {
      const data = await fs.readFile(LEADS_FILE, 'utf8')
      leads = JSON.parse(data)
    } catch (error) {
      // File doesn't exist yet
    }

    leads.push(lead)
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
    
    console.log(`Lead saved: ${lead.email}`)
    return lead
  } catch (error) {
    console.error('Error saving lead:', error)
    throw error
  }
}

async function getLeads() {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

module.exports = { saveLead, getLeads }
```

---

**All components are ready to copy-paste into your project!**

