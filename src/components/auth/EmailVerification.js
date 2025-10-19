import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/EmailVerification.css';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`verification-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`verification-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyEmail(user.matricNo, code);
      setMessage('Email verified successfully!');
      // Redirect or update user state here
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      await authService.resendVerification(user.matricNo);
      setMessage('Verification code sent to your email');
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-verification">
      <div className="verification-card">
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit verification code to your email address</p>
        
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="code-inputs">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`verification-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="code-input"
                disabled={loading}
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading || verificationCode.join('').length !== 6}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Verify Email'}
          </button>
        </form>

        <div className="verification-actions">
          <p>Didn't receive the code?</p>
          <button 
            onClick={handleResendCode}
            disabled={loading || countdown > 0}
            className="btn btn-outline"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;