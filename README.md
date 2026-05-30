# 🤖 SupportBot — AI Customer Support Chatbot

> A generic AI-powered customer support chatbot built with React, Node.js, and Groq (LLaMA 3). Works for any business — just configure your business name and description.

---

## 🚀 Features

- **AI Responses** — Powered by Groq LLaMA 3 (free & fast)
- **Generic** — Works for any business, just set env variables
- **Quick Questions** — One-click starter prompts
- **Topic Sidebar** — Quick navigation to common support topics
- **Typing Indicator** — Animated dots while AI is thinking
- **Chat History** — Full conversation context sent to AI
- **New Conversation** — Clear and start fresh anytime

---

## 📁 Project Structure

```
supportbot/
├── backend/
│   ├── routes/
│   │   └── chat.js       # POST /api/chat (Groq integration)
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Full chat UI
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your GROQ_API_KEY, BUSINESS_NAME, BUSINESS_DESCRIPTION
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** 🎉

---

## 🔧 Customization

In `backend/.env`, set:

```env
GROQ_API_KEY=your_real_groq_key
BUSINESS_NAME=Your Company Name
BUSINESS_DESCRIPTION=We sell handmade candles and home decor products.
```

The AI will automatically use your business name and description in every response!

---

## 🌐 Deployment (Render)

**Backend** — Web Service:
- Root Directory: `backend`
- Build: `npm install`
- Start: `node server.js`
- Env vars: `GROQ_API_KEY`, `BUSINESS_NAME`, `BUSINESS_DESCRIPTION`, `CLIENT_URL`

**Frontend** — Static Site:
- Root Directory: `frontend`
- Build: `npm install && npm run build`
- Publish: `dist`

---

## 📄 License

MIT © 2024
