import { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 🌿 I’m BASHO AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      // Check if response has error
      if (!res.ok || data.error) {
        const errorMsg = data.error || "Failed to get response from AI";
        console.error("API Error:", errorMsg);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Error: ${errorMsg}` }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.reply }
        ]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Connection error: ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        🤖
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            BASHO AI
            <span onClick={() => setOpen(false)}>✕</span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="msg bot">Typing…</div>}
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pottery, workshops…"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
