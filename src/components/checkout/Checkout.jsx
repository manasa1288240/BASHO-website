// src/components/Checkout/Checkout.jsx
import { useState } from 'react';
import { createRazorpayOrder, initiateRazorpayPayment } from '../../services/paymentService';
import './Checkout.css';

const Checkout = ({ cartItems, totalAmount }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handlePayment = async () => {
    // Validate user data
    if (!userData.name || !userData.email || !userData.phone) {
      alert('Please fill in all your details');
      return;
    }

    if (!totalAmount || totalAmount <= 0) {
      alert('Invalid amount');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      console.log('Step 1: Creating order for amount:', totalAmount);
      const order = await createRazorpayOrder(totalAmount);
      
      // 2. Initiate Razorpay payment
      console.log('Step 2: Opening Razorpay modal');
      await initiateRazorpayPayment(
        order,
        userData,
        // Success handler
        async (paymentResponse) => {
          console.log('✅ Payment successful!', paymentResponse);
          alert('Payment successful! Thank you for your order.');
          setLoading(false);
          // Here you can redirect to success page or clear cart
        },
        // Failure handler
        (errorMessage) => {
          console.error('🔴 Payment failed:', errorMessage);
          alert(`Payment failed: ${errorMessage}`);
          setLoading(false);
        }
      );

    } catch (error) {
      console.error('🔴 Payment process error:', error);
      alert(`Payment error: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="order-total">
          <strong>Total:</strong>
          <strong>₹{totalAmount}</strong>
        </div>
      </div>

      <div className="user-details">
        <h3>Your Details</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={userData.name}
          onChange={(e) => setUserData({...userData, name: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({...userData, email: e.target.value})}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={userData.phone}
          onChange={(e) => setUserData({...userData, phone: e.target.value})}
        />
      </div>

      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="pay-button"
      >
        {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
      </button>

      {loading && <p className="loading-text">Please wait, opening payment gateway...</p>}
    </div>
  );
};

export default Checkout;