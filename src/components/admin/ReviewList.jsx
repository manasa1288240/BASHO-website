import { useEffect, useState } from "react";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  async function loadReviews() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/reviews`);
      const data = await res.json();

      if (data?.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const res = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to delete review");
        return;
      }

      loadReviews();
    } catch (err) {
      console.error("Delete review failed:", err);
      alert("Error deleting review");
    }
  };

  const renderStars = (rating) => {
    const safeRating = Number(rating) || 0;
    return "⭐".repeat(safeRating);
  };

  return (
    <div className="admin-table-container">
      <h2>Customer Reviews</h2>

      {loading ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Loading reviews...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Rating</th>
              <th>Review Feedback</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <tr key={r._id}>
                  <td>
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td style={{ color: "#8e5022", fontWeight: "bold" }}>
                    {renderStars(r.rating)} ({r.rating}/5)
                  </td>

                  <td>{r.review}</td>

                  <td>
                    <button
                      onClick={() => handleDelete(r._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No reviews found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
