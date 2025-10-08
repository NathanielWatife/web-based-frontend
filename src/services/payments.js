import api from './api';

export const paymentsAPI = {
    initializePaystack: async (paymentData) => {
        const response = await api.post('/payments/initialize-paystack/', paymentData);
        return response.data;
    },

    initializeFlutterwave: async (paymentData) => {
        const response = await api.post('/payments/initialize-flutterwave/', paymentData);
    },

    verifyPayment: async (provider, verificationData) => {
        const endpoint = provider === 'paystack' ? '/payments/verify-paystack/' : '/payments/verify-flutterwave/';

        const response = await api.post(endpoint, verificationData);
        return response.data;
    },

    verifyPaystack: async (verificationData) => {
        const response = await api.post('/payments/verify-paystack/', verificationData);
        return response.data;
    },

    verifyFlutterwave: async (verificationData) => {
        const response = await api.post('/payments/verify-flutterwave/', verificationData);
        return response.data;
    }
};