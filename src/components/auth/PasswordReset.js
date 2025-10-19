import React, { useState } from 'react';
import { authService } from '../../services/authService';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/PasswordReset.css';

const PasswordReset = () => {
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword(formData.email);
      setMessage('Password reset instructions sent to your email');
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword(formData.token, formData.newPassword);
      setMessage('Password reset successfully! You can now login with your new password.');
      setStep(3);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="password-reset">
        <div className="reset-card">
          <h2>Reset Your Password</h2>
          <p>Enter your email address and we'll send you reset instructions</p>
          
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleRequestReset}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" /> : 'Send Reset Instructions'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="password-reset">
        <div className="reset-card">
          <h2>Set New Password</h2>
          <p>Enter the token from your email and your new password</p>
          
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">Reset Token</label>
              <input
                type="text"
                name="token"
                value={formData.token}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-input"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                required
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" /> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset">
      <div className="reset-card">
        <div className="success-state">
          <div className="success-icon">✓</div>
          <h2>Password Reset Successful!</h2>
          <p>Your password has been reset successfully. You can now login with your new password.</p>
          <a href="/login" className="btn btn-primary">Go to Login</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;