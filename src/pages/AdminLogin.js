import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const AdminLogin = () => {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Admin Login</h1>
          <p>Administrator access portal</p>
        </div>
      </div>
      <LoginForm isAdmin={true} />
    </div>
  );
};

export default AdminLogin;