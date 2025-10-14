export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const PICKUP_OPTIONS = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup'
};