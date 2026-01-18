import { useEffect, useState } from "react";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/api/admin/messages`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Error fetching messages:", err));
  }, []);

  return (
    <div className="admin-table-container">
      <h2>Customer Messages</h2>
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
          {messages.map((m) => (
            <tr key={m._id}>
              <td>{new Date(m.date).toLocaleDateString()}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}