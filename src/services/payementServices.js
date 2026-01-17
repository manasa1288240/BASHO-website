// src/services/paymentService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://basho-backend.onrender.com/api';

export const createRazorpayOrder = async (amount) => {
  try {
    console.log('🟡 Creating Razorpay order for amount:', amount);
    
    const response = await axios.post(`${API_BASE_URL}/payment/create-order`, {
      amount: Number(amount)
    });
    
    console.log('🟢 Order created:', response.data);
    return response.data;
  } catch (error) {
    console.error('🔴 Error creating order:', error.response?.data || error.message);
    throw error;
  }
};

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('✅ Razorpay script loaded');
      resolve(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (order, userData, onSuccess, onFailure) => {
  try {
    const razorpayLoaded = await loadRazorpayScript();
    
    if (!razorpayLoaded) {
      throw new Error('Failed to load payment gateway');
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_S2dB2rrkK9f1cG',
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'BASHO by Shivangi',
      description: 'Handcrafted Japanese Pottery',
      order_id: order.id,
      handler: function (response) {
        console.log('✅ Payment successful:', response);
        if (onSuccess) onSuccess(response);
      },
      prefill: {
        name: userData?.name || '',
        email: userData?.email || '',
        contact: userData?.phone || ''
      },
      notes: {
        address: 'BASHO Pottery Studio'
      },
      theme: {
        color: '#8B4513' // Brown theme matching your pottery
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
          if (onFailure) onFailure('Payment cancelled by user');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    
    razorpay.on('payment.failed', function (response) {
      console.error('🔴 Payment failed:', response.error);
      if (onFailure) onFailure(response.error.description || 'Payment failed');
    });

  } catch (error) {
    console.error('🔴 Error initiating payment:', error);
    if (onFailure) onFailure(error.message);
  }
};