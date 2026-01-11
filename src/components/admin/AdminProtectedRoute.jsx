import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem('admin_token');
  const adminEmail = localStorage.getItem('admin_email');

  // Check if admin token exists
  if (!adminToken || !adminEmail) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
