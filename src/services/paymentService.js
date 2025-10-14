import api from './api';

export const paymentService = {
  async initializePayment(paymentData) {
    const response = await api.post('/payments/initialize', paymentData);
    return response.data;
  },

  async verifyPayment(reference) {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  },

  // For direct Paystack integration (client-side)
  initializePaystackCheckout(amount, email, callback) {
    if (window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amount * 100, // Convert to kobo
        currency: 'NGN',
        ref: `PS_${Math.floor(Math.random() * 1000000000 + 1)}`,
        callback: function(response) {
          callback(response);
        },
        onClose: function() {
          callback({ cancelled: true });
        }
      });
      handler.openIframe();
    } else {
      console.error('Paystack not loaded');
    }
  }
};

// Load Paystack script dynamically
export const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack'));
    document.head.appendChild(script);
  });
};