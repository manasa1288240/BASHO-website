import { useState } from "react";
import "./ActionSection.css";

export default function Modal({ type, close }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Backend base URL (works in Vercel + local)
  const API_URL = import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  // State to hold form values
  const [formData, setFormData] = useState({});

  // Function to handle input changes dynamically
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Choose the correct endpoint based on the modal type
      const endpoint =
        type === "event"
          ? `${API_URL}/api/workshops/submit-event`
          : `${API_URL}/api/workshops/host-event`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <button className="close-btn" onClick={close}>
          ×
        </button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <h2>{type === "event" ? "Event Booking" : "Collaborate With Us"}</h2>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              {type === "event" ? (
                <>
                  <input
                    name="userName"
                    type="text"
                    placeholder="Your Name"
                    required
                    onChange={handleChange}
                  />
                  <input
                    name="eventTitle"
                    type="text"
                    placeholder="Event Name"
                    required
                    onChange={handleChange}
                  />
                  <input
                    name="location"
                    type="text"
                    placeholder="Location / Place"
                    required
                    onChange={handleChange}
                  />
                  <input
                    name="eventDate"
                    type="datetime-local"
                    required
                    onChange={handleChange}
                  />
                  <input
                    name="eventType"
                    type="text"
                    placeholder="Type of Event"
                    required
                    onChange={handleChange}
                  />
                  <input
                    name="userEmail"
                    type="email"
                    placeholder="Your Email"
                    required
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    onChange={handleChange}
                  />
                  <input
                    name="brand"
                    type="text"
                    placeholder="Brand / Organization"
                    required
                    onChange={handleChange}
                  />
                  <textarea
                    name="details"
                    placeholder="How would you like to collaborate?"
                    required
                    onChange={handleChange}
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    required
                    onChange={handleChange}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    onChange={handleChange}
                  />
                </>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <h2>Thank you!</h2>
            <p>
              {type === "event"
                ? "Your event request has been successfully submitted. We’ve sent a confirmation email to you."
                : "Your collaboration request has been successfully submitted. Check your inbox for a confirmation."}
            </p>
            <button className="submit-btn" onClick={close}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
