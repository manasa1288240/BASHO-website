import { useEffect, useState } from "react";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/admin/messages`);
        const data = await res.json();

        // ✅ your backend returns { success: true, messages: [] }
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [API_URL]);

  return (
    <div className="admin-table-container">
      <h2>Customer Messages</h2>

      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>
            {messages.length > 0 ? (
              messages.map((m) => (
                <tr key={m._id}>
                  <td>
                    {new Date(m.createdAt || m.date || Date.now()).toLocaleDateString()}
                  </td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No messages found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
