import { useState } from 'react';
import './AdminSettings.css';

export default function AdminSettings() {
  const adminEmail = localStorage.getItem('admin_email');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to change password');

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      <h1>Admin Settings</h1>

      {/* Account Information */}
      <div className="settings-section">
        <h2>Account Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Email Address</label>
            <p className="info-value">{adminEmail}</p>
          </div>
          <div className="info-item">
            <label>Account Status</label>
            <p className="info-value">
              <span className="status-badge status-active">Active</span>
            </p>
          </div>
          <div className="info-item">
            <label>Member Since</label>
            <p className="info-value">January 2024</p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="settings-section">
        <h2>Security</h2>
        <button
          className="btn-toggle"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? 'Cancel' : 'Change Password'}
        </button>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            {message.text && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>

      {/* System Information */}
      <div className="settings-section">
        <h2>System Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Admin Panel Version</label>
            <p className="info-value">1.0.0</p>
          </div>
          <div className="info-item">
            <label>Frontend Version</label>
            <p className="info-value">React 18.2</p>
          </div>
          <div className="info-item">
            <label>API Endpoint</label>
            <p className="info-value">http://localhost:5000</p>
          </div>
          <div className="info-item">
            <label>Last Updated</label>
            <p className="info-value">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="settings-section">
        <h2>Help & Support</h2>
        <div className="support-links">
          <a href="#" className="support-link">📖 Documentation</a>
          <a href="#" className="support-link">❓ FAQ</a>
          <a href="#" className="support-link">💬 Contact Support</a>
          <a href="#" className="support-link">🐛 Report Issue</a>
        </div>
      </div>
    </div>
  );
}
