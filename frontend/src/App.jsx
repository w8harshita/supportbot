import { useState, useRef, useEffect } from "react";

const BUSINESS_NAME = "SupportBot";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0a0a0f;
    --surface:   #12121a;
    --card:      #1a1a26;
    --border:    #2a2a3d;
    --accent:    #7c6af7;
    --accent2:   #f76aab;
    --text:      #e8e8f0;
    --muted:     #7070a0;
    --user-bg:   #7c6af7;
    --bot-bg:    #1a1a26;
    --success:   #6af7a8;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
    overflow: hidden;
  }

  .app {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 280px;
    min-width: 280px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 28px 20px;
    gap: 24px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .logo-text {
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .new-chat-btn {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none;
    color: white;
    font-family: var(--font-head);
    font-size: 14px;
    font-weight: 600;
    padding: 12px 16px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: opacity 0.2s, transform 0.15s;
    letter-spacing: 0.3px;
  }

  .new-chat-btn:hover { opacity: 0.88; transform: translateY(-1px); }

  .sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sidebar-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0 4px;
    margin-bottom: 4px;
  }

  .topic-chip {
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 13px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
  }

  .topic-chip:hover {
    background: var(--card);
    color: var(--text);
    border-color: var(--border);
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 6px var(--success);
    flex-shrink: 0;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .status-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
    margin-top: auto;
    padding: 12px;
    background: var(--card);
    border-radius: 10px;
    border: 1px solid var(--border);
  }

  /* ── Main chat area ── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .chat-header {
    padding: 20px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    flex-shrink: 0;
  }

  .chat-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .agent-avatar {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .agent-info h3 {
    font-family: var(--font-head);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.2px;
  }

  .agent-info p {
    font-size: 12px;
    color: var(--success);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.15s;
  }

  .icon-btn:hover { background: var(--card); color: var(--text); }

  /* ── Messages ── */
  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scroll-behavior: smooth;
  }

  .messages-area::-webkit-scrollbar { width: 4px; }
  .messages-area::-webkit-scrollbar-track { background: transparent; }
  .messages-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* Welcome screen */
  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 20px;
    text-align: center;
    padding: 40px;
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .welcome-icon {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, var(--accent)22, var(--accent2)22);
    border: 1px solid var(--accent)44;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
  }

  .welcome h2 {
    font-family: var(--font-head);
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .welcome p {
    color: var(--muted);
    font-size: 15px;
    max-width: 380px;
    line-height: 1.6;
  }

  .quick-questions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    max-width: 500px;
    margin-top: 8px;
  }

  .quick-q {
    padding: 9px 16px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--text);
    font-size: 13px;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.15s;
  }

  .quick-q:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent)11;
  }

  /* Message bubbles */
  .message-row {
    display: flex;
    gap: 12px;
    animation: fadeUp 0.3s ease both;
  }

  .message-row.user {
    flex-direction: row-reverse;
  }

  .msg-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .msg-avatar.bot {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
  }

  .msg-avatar.user {
    background: var(--card);
    border: 1px solid var(--border);
  }

  .bubble {
    max-width: 68%;
    padding: 13px 16px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.6;
  }

  .bubble.bot {
    background: var(--bot-bg);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    color: var(--text);
  }

  .bubble.user {
    background: var(--user-bg);
    border-bottom-right-radius: 4px;
    color: white;
  }

  .msg-time {
    font-size: 11px;
    color: var(--muted);
    margin-top: 5px;
    padding: 0 4px;
  }

  .message-row.user .msg-time { text-align: right; }

  /* Typing indicator */
  .typing-bubble {
    background: var(--bot-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    border-bottom-left-radius: 4px;
    padding: 14px 18px;
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .typing-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: typingBounce 1.2s ease-in-out infinite;
  }

  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30%            { transform: translateY(-6px); opacity: 1; }
  }

  /* ── Input area ── */
  .input-area {
    padding: 20px 28px;
    border-top: 1px solid var(--border);
    background: var(--surface);
    flex-shrink: 0;
  }

  .input-box {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 10px 10px 10px 18px;
    transition: border-color 0.2s;
  }

  .input-box:focus-within {
    border-color: var(--accent);
  }

  .chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    resize: none;
    max-height: 120px;
    line-height: 1.5;
    padding: 4px 0;
  }

  .chat-input::placeholder { color: var(--muted); }

  .send-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: opacity 0.2s, transform 0.15s;
    font-size: 16px;
  }

  .send-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .input-hint {
    font-size: 11px;
    color: var(--muted);
    margin-top: 8px;
    text-align: center;
  }

  /* Error toast */
  .error-toast {
    background: #f76a6a22;
    border: 1px solid #f76a6a55;
    color: #f76a6a;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 12px;
    text-align: center;
  }
`;

const QUICK_QUESTIONS = [
  "How do I contact support?",
  "What are your business hours?",
  "How do I request a refund?",
  "I have a billing question",
  "Track my order",
  "Report a technical issue",
];

const TOPICS = [
  { icon: "📦", label: "Orders & Shipping" },
  { icon: "💳", label: "Billing & Payments" },
  { icon: "🔧", label: "Technical Support" },
  { icon: "↩️",  label: "Returns & Refunds" },
  { icon: "👤", label: "Account Help" },
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function App() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const bottomRef                 = useRef(null);
  const textareaRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");
    setError("");

    const userMsg = { role: "user", content: userText, time: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    // Resize textarea
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      // FIXED — handles empty responses safely
      const text = await res.text();  // read as plain text first
      const data = text ? JSON.parse(text) : {};  // only parse if not empty
      if (!res.ok) throw new Error(data.error || `Server error: ${res.status}`);

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply, time: new Date() }
      ]);
    } catch (err) {
      setError(err.message || "Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">🤖</div>
            <span className="logo-text">SupportBot</span>
          </div>

          <button className="new-chat-btn" onClick={clearChat}>
            ✦ New Conversation
          </button>

          <div className="sidebar-section">
            <div className="sidebar-label">Topics</div>
            {TOPICS.map(t => (
              <div
                key={t.label}
                className="topic-chip"
                onClick={() => sendMessage(`I need help with ${t.label}`)}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </div>

          <div className="status-line" style={{ marginTop: "auto" }}>
            <div className="status-dot" />
            <span>AI Agent Online</span>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="main">

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="agent-avatar">🤖</div>
              <div className="agent-info">
                <h3>Support Assistant</h3>
                <p><span style={{ fontSize: 8 }}>●</span> Online · Typically replies instantly</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="icon-btn" title="Clear chat" onClick={clearChat}>🗑</button>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-icon">💬</div>
                <h2>How can we help you?</h2>
                <p>Ask me anything — I'm here to help with orders, billing, technical issues, and more.</p>
                <div className="quick-questions">
                  {QUICK_QUESTIONS.map(q => (
                    <button key={q} className="quick-q" onClick={() => sendMessage(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`message-row ${msg.role === "user" ? "user" : "bot"}`}>
                  <div className={`msg-avatar ${msg.role === "user" ? "user" : "bot"}`}>
                    {msg.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div>
                    <div className={`bubble ${msg.role === "user" ? "user" : "bot"}`}>
                      {msg.content}
                    </div>
                    <div className="msg-time">{formatTime(msg.time)}</div>
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="message-row bot">
                <div className="msg-avatar bot">🤖</div>
                <div className="typing-bubble">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}

            {/* Error */}
            {error && <div className="error-toast">⚠️ {error}</div>}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            <div className="input-box">
              <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder="Type your message... (Enter to send)"
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={loading}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                ➤
              </button>
            </div>
            <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
          </div>

        </main>
      </div>
    </>
  );
}
