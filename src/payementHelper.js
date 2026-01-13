// src/utils/paymentHelper.js
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      console.log('Razorpay already loaded');
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
      resolve(window.Razorpay);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      resolve(null);
    };
    
    document.body.appendChild(script);
  });
};

export const createTestPayment = async (amount = 100) => {
  try {
    console.log('🟡 Starting test payment...');
    
    // 1. Load Razorpay
    const Razorpay = await loadRazorpay();
    if (!Razorpay) {
      throw new Error('Failed to load payment gateway');
    }
    
    // 2. Create order (using test endpoint)
    const response = await fetch('http://localhost:5000/api/payment/test-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amount }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    const order = await response.json();
    console.log('✅ Order created:', order);
    
    // 3. Open Razorpay
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE', // Get from Razorpay dashboard
      amount: order.amount,
      currency: order.currency,
      name: 'BASHO Pottery',
      description: 'Test Transaction',
      order_id: order.id,
      handler: function (response) {
        console.log('✅ Payment successful!', response);
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#F37254'
      }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
    
    rzp.on('payment.failed', function (response) {
      console.error('❌ Payment failed:', response.error);
      alert('Payment failed: ' + (response.error.description || 'Unknown error'));
    });
    
  } catch (error) {
    console.error('🔴 Payment error:', error);
    alert('Payment error: ' + error.message);
  }
};

// Simple test button component
export const TestPaymentButton = () => {
  return (
    <button 
      onClick={() => createTestPayment(100)}
      style={{
        padding: '12px 24px',
        backgroundColor: '#10B981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        margin: '20px'
      }}
    >
      Test Payment (₹100)
    </button>
  );
};