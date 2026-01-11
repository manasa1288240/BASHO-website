import './AdminHeader.css';

export default function AdminHeader() {
  const adminEmail = localStorage.getItem('admin_email');

  return (
    <div className="admin-header">
      <div className="header-content">
        <h1>Dashboard</h1>
        <div className="header-info">
          <span className="admin-email">👤 {adminEmail}</span>
          <span className="timestamp">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
