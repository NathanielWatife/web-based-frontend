export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
export const FLUTTERWAVE_PUBLIC_KEY = process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY;

export const USER_ROLES = {
    STUDENT: 'student',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
};

export const ORDER_STATUSES = {
    PENDING: 'pending',
    PAID: 'paid',
    PROCESSING: 'processing',
    READY: 'ready',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
    PAYSTACK: 'paystack',
    FLUTTERWAVE: 'flutterwave',
};

