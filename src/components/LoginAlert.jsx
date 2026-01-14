import React from "react";
import "./LoginAlert.css";

export default function LoginAlert({ onClose, onConfirm }) {
  return (
    <div className="login-alert-overlay">
      <div className="login-alert-modal">
        <div className="login-alert-header">
          <h2>Authentication Required</h2>
        </div>
        <div className="login-alert-body">
          <p>You need to log in to perform this action</p>
        </div>
        <div className="login-alert-actions">
          <button className="login-alert-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="login-alert-btn-confirm" onClick={onConfirm}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
