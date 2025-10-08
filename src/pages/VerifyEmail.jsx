import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VerificationForm from '../components/auth/VerificationForm';

const VerifyEmail = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <VerificationForm />;
};

export default VerifyEmail;