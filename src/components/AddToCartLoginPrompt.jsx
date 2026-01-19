import { useNavigate } from "react-router-dom";
import "./AddToCartLoginPrompt.css";

export default function AddToCartLoginPrompt({ onClose }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/auth");
    onClose();
  };

  return (
    <div className="login-prompt-overlay">
      <div className="login-prompt-modal">
        <h2>Login Required</h2>
        <p>Please sign in first to add items to your cart</p>
        
        <div className="prompt-buttons">
          <button className="login-btn" onClick={handleLogin}>
            Sign In
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
