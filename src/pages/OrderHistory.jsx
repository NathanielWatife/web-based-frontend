import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderHistory from '../components/profile/OrderHistory';

const OrderHistoryPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Home</span>
            <span>›</span>
            <span>Profile</span>
            <span>›</span>
            <span className="text-gray-900">Orders</span>
          </nav>
        </div>

        <OrderHistory />
      </div>
    </div>
  );
};

export default OrderHistoryPage;