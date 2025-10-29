import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/AuthForms.css';

const LoginForm = ({ isAdmin = false }) => {
  const [formData, setFormData] = useState({
    matricNo: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, adminLogin, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let result;
    if (isAdmin) {
      result = await adminLogin(formData.email, formData.password);
    } else {
      result = await login(formData.matricNo, formData.password);
    }

    setIsLoading(false);

    if (result.success) {
      navigate(isAdmin ? '/admin/dashboard' : '/');
    } else if (!isAdmin && result.needsVerification) {
      navigate('/verify-email', {
        state: {
          matricNo: formData.matricNo,
          email: result.email,
          message: result.message || 'Please enter the 6-digit code we emailed to verify your account.'
        }
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isAdmin ? 'Admin Login' : 'Student Login'}</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isAdmin ? (
            <div className="form-group">
              <label className="form-label">Matriculation Number</label>
              <input
                type="text"
                name="matricNo"
                value={formData.matricNo}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., F/ND/23/3210090"
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="admin@yabatech.edu.ng"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Login'}
          </button>
        </form>

        {!isAdmin && (
          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
            <p>
              <Link to="/forgot-password">Forgot your password?</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;