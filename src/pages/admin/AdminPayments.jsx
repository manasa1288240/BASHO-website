import { useState, useEffect } from 'react';
import './AdminPayments.css';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMethod, setFilterMethod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchMethod = filterMethod === 'all' || payment.paymentMethod === filterMethod;
    const matchSearch =
      payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayId?.includes(searchTerm) ||
      payment.orderId?.includes(searchTerm);
    return matchMethod && matchSearch;
  });

  const stats = {
    total: payments.length,
    totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    successful: payments.filter(p => p.status === 'successful').length,
    pending: payments.filter(p => p.status === 'pending').length,
    razorpay: payments.filter(p => p.paymentMethod === 'razorpay').length,
  };

  if (loading) return <div className="loading">Loading payments...</div>;

  return (
    <div className="admin-payments">
      <h1>Payment & Revenue Tracking</h1>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Transactions</p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card success">
          <p className="stat-label">Successful</p>
          <p className="stat-value">{stats.successful}</p>
        </div>
        <div className="stat-card pending">
          <p className="stat-label">Pending</p>
          <p className="stat-value">{stats.pending}</p>
        </div>
        <div className="stat-card razorpay">
          <p className="stat-label">Razorpay</p>
          <p className="stat-value">{stats.razorpay}</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, order ID, or payment ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
          <option value="all">All Methods</option>
          <option value="razorpay">Razorpay</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="wallet">Wallet</option>
          <option value="cash">Cash on Delivery</option>
        </select>
      </div>

      {filteredPayments.length > 0 ? (
        <div className="payments-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Payment ID</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className={`status-${payment.status}`}>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>{payment.customerName}</td>
                  <td className="order-id">{payment.orderId?.slice(-6)}</td>
                  <td className="amount">₹{payment.amount}</td>
                  <td>
                    <span className="method-badge">{payment.paymentMethod}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${payment.status}`}>
                      {payment.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="payment-id" title={payment.razorpayId}>
                    {payment.razorpayId?.slice(0, 8)}...
                  </td>
                  <td>
                    <details className="payment-details">
                      <summary>View</summary>
                      <div className="details-content">
                        <p><strong>Email:</strong> {payment.email}</p>
                        <p><strong>Phone:</strong> {payment.phone}</p>
                        <p><strong>Full Payment ID:</strong> {payment.razorpayId}</p>
                        <p><strong>Signature:</strong> {payment.signature?.slice(0, 20)}...</p>
                        <p><strong>Item Count:</strong> {payment.itemCount || '-'}</p>
                        <p><strong>Type:</strong> {payment.type || 'Product Order'}</p>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-payments">No payments found</p>
      )}
    </div>
  );
}
