import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

// --- Beautiful Minimalist Icons ---
const IconPot = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12l1 7c0 5-3 9-7 9s-7-4-7-9l1-7z" />
    <path d="M3 10h18" />
    <path d="M12 19v3" />
    <path d="M8 22h8" />
  </svg>
);

const IconCalendar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconCollab = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

const IconCustom = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
  </svg>
);

const IconCare = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconMapper = {
  view_products: <IconPot />,
  book_workshops: <IconCalendar />,
  collab_info: <IconCollab />,
  custom_orders: <IconCustom />,
  care_guide: <IconCare />,
  menu: <IconPot />,
};

export default function Chatbot() {
  // ✅ Backend base URL (works in Vercel + local)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! Welcome to BASHO. How can I assist you?",
      options: [
        { label: "Pottery Collection", value: "view_products" },
        { label: "Book a Workshop", value: "book_workshops" },
        { label: "Collaborations", value: "collab_info" },
        { label: "Custom Orders", value: "custom_orders" },
        { label: "Care Guide", value: "care_guide" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, loading, open]);

  const sendMessage = async (payload) => {
    const messageValue = typeof payload === "string" ? payload : input;
    if (!messageValue.trim()) return;

    const displayLabel =
      typeof payload === "string"
        ? messages[messages.length - 1]?.options?.find((o) => o.value === payload)
            ?.label || payload
        : payload;

    setMessages((prev) => [...prev, { sender: "user", text: displayLabel }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageValue }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply, options: data.options },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-outer-container">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            BASHO AI
            <span onClick={() => setOpen(false)} style={{ cursor: "pointer" }}>
              ✕
            </span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className="msg-wrapper">
                <div className={`msg ${msg.sender}`}>{msg.text}</div>

                {msg.sender === "bot" && msg.options && (
                  <div className="chat-options">
                    {msg.options.map((opt, index) => (
                      <button
                        key={index}
                        className="opt-btn"
                        onClick={() => sendMessage(opt.value)}
                      >
                        {IconMapper[opt.value] || <IconPot />}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && <div className="msg bot">Typing…</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pottery..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />
            <button className="send-btn" onClick={() => sendMessage(input)}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle Area: Bubble to the side of the Button */}
      <div className="chatbot-toggle-area">
        {!open && <div className="chatbot-dialogue-bubble">Hi! I'm BASHO AI 🏺</div>}

        <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
          <IconPot />
        </button>
      </div>
    </div>
  );
}
