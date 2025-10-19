import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import CheckoutForm from '../components/checkout/CheckoutForm';

const Checkout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>
      </div>
      <CheckoutForm />
    </div>
  );
};

export default Checkout;