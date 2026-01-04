import { useState } from "react";
import "./ActionSection.css";

export default function Modal({ type, close }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault(); // stop page refresh
    setSubmitted(true);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box">

        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={close}>×</button>

        {!submitted ? (
          <>
            {/* HEADER */}
            <div className="modal-header">
              <h2>
                {type === "event"
                  ? "Event Booking"
                  : "Collaborate With Us"}
              </h2>
            </div>

            {/* FORM */}
            <form className="modal-form" onSubmit={handleSubmit}>
              {type === "event" ? (
                <>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Event Name"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location / Place"
                    required
                  />
                  <input
                    type="datetime-local"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Type of Event"
                    required
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Brand / Organization"
                    required
                  />
                  <textarea
                    placeholder="How would you like to collaborate?"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                  />
                </>
              )}

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </>
        ) : (
          /* SUCCESS MESSAGE */
          <div className="success-message">
            <h2>Thank you!</h2>
            <p>
              {type === "event"
                ? "Your event request has been successfully submitted. We’ll get back to you soon."
                : "Your collaboration request has been successfully submitted. We’ll reach out shortly."}
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
