import { useEffect, useState } from "react";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Fetching from the Review endpoint
    fetch(`${API_URL}/api/admin/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews:", err));
  }, []);

  // Helper to render stars visually
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <div className="admin-table-container">
      <h2>Customer Reviews</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Rating</th>
            <th>Review Feedback</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <tr key={r._id}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td style={{ color: "#8e5022", fontWeight: "bold" }}>
                  {renderStars(r.rating)} ({r.rating}/5)
                </td>
                <td>{r.review}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                No reviews found yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}