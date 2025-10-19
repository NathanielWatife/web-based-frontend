import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Student Login</h1>
          <p>Access your account using your matriculation number</p>
        </div>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;