// ============================================================
//  SupportBot — POST /api/chat
//  File: backend/routes/chat.js
// ============================================================
const express = require("express");
const router  = express.Router();

const BUSINESS_NAME        = process.env.BUSINESS_NAME        || "Our Company";
const BUSINESS_DESCRIPTION = process.env.BUSINESS_DESCRIPTION || "We provide excellent products and services.";

const SYSTEM_PROMPT = `You are a friendly and professional customer support agent for ${BUSINESS_NAME}.

About the business: ${BUSINESS_DESCRIPTION}

Your job:
- Answer customer questions helpfully and politely
- Keep responses concise (2-4 sentences max unless detail is needed)
- If you don't know something specific, say "I'll connect you with a human agent who can help with that"
- Never make up order numbers, prices, or specific policies you don't know
- Always be empathetic and solution-focused
- Use a warm, professional tone

Common topics you can help with:
- General product/service questions
- How to contact support
- Business hours and location
- Return/refund policies (general guidance)
- Account and billing questions (general guidance)
- Technical troubleshooting (general steps)

If asked something outside your knowledge, offer to escalate to a human agent.`;

// POST /api/chat
router.post("/", async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    // Keep only last 20 messages to avoid token overflow
    const recentMessages = messages.slice(-20);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...recentMessages
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Groq API error");
    }

    const data  = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    res.json({ success: true, reply });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
