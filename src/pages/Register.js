import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Student Registration</h1>
          <p>Create your account to start purchasing books</p>
        </div>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;