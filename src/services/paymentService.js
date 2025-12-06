import api from './api';

export const paymentService = {
  /**
   * Initialize payment through backend
   * Backend will return authorization URL for the chosen gateway
   */
  initializePayment: (paymentData) => {
    return api.post('/payments/initialize', paymentData);
  },

  /**
   * Verify payment after user completes transaction
   */
  verifyPayment: (reference) => {
    return api.get(`/payments/verify/${reference}`);
  },

  /**
   * List saved payment methods for user
   */
  listPaymentMethods: () => {
    return api.get('/payments/methods');
  },

  /**
   * Delete a saved payment method
   */
  deletePaymentMethod: (methodId) => {
    return api.delete(`/payments/methods/${methodId}`);
  },

  /**
   * Load Paystack script dynamically
   */
  loadPaystackScript: () => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.head.appendChild(script);
    });
  },

  /**
   * Load Flutterwave script dynamically
   */
  loadFlutterwaveScript: () => {
    return new Promise((resolve, reject) => {
      if (window.FlutterwaveCheckout) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Flutterwave script'));
      document.head.appendChild(script);
    });
  },

  /**
   * Initialize and open Paystack payment dialog
   * Should be called after backend initializes payment
   */
  initializePaystack: (authorizationUrl) => {
    return new Promise((resolve, reject) => {
      if (!authorizationUrl) {
        reject(new Error('Authorization URL is required'));
        return;
      }

      // Redirect to Paystack authorization URL
      // Paystack will handle the payment and redirect back
      window.location.href = authorizationUrl;
      resolve();
    });
  },

  /**
   * Initialize and open Flutterwave payment dialog
   * Should be called after backend initializes payment
   */
  initializeFlutterwave: (authorizationUrl) => {
    return new Promise((resolve, reject) => {
      if (!authorizationUrl) {
        reject(new Error('Authorization URL is required'));
        return;
      }

      // Redirect to Flutterwave authorization URL
      window.location.href = authorizationUrl;
      resolve();
    });
  },

  /**
   * Get payment gateway availability status
   */
  checkPaymentGateway: () => {
    return api.get('/payments/status').catch(() => {
      // If endpoint doesn't exist, assume defaults
      return {
        data: {
          paystack: !!process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
          flutterwave: !!process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY
        }
      };
    });
  },

  /**
   * Format amount in Naira for display
   */
  formatAmount: (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  }
};