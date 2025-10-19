import api from './api';

export const paymentService = {
  initializePayment: (paymentData) => {
    return api.post('/payments/initialize', paymentData);
  },

  verifyPayment: (reference) => {
    return api.get(`/payments/verify/${reference}`);
  },

  // Paystack integration
  initializePaystack: (email, amount, reference, metadata = {}) => {
    const handler = window.PaystackPop && window.PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // Convert to kobo
      reference,
      metadata,
      onClose: () => {
        console.log('Payment window closed.');
      },
      callback: (response) => {
        return response;
      }
    });
    
    if (handler) {
      handler.openIframe();
    }
  },

  // Flutterwave integration
  initializeFlutterwave: (email, amount, reference, metadata = {}) => {
    return new Promise((resolve, reject) => {
      if (window.FlutterwaveCheckout) {
        window.FlutterwaveCheckout({
          public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
          tx_ref: reference,
          amount,
          currency: 'NGN',
          payment_options: 'card, banktransfer, ussd',
          customer: {
            email,
          },
          customizations: {
            title: 'YabaTech BookStore',
            description: 'Payment for books',
            logo: '/logo.png',
          },
          callback: (response) => resolve(response),
          onclose: () => reject(new Error('Payment closed')),
        });
      } else {
        reject(new Error('Flutterwave not loaded'));
      }
    });
  }
};