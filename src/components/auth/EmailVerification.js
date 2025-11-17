import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import LoadingSpinner from '../common/LoadingSpinner';
import FullScreenLoader from '../common/FullScreenLoader';
import toast from 'react-hot-toast';
import '../../styles/EmailVerification.css';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState('');
  const { user, authenticateWithToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const qpMatricNo = searchParams.get('matricNo');
  const qpEmail = searchParams.get('email');
  const pendingMatricNo = qpMatricNo || location.state?.matricNo || user?.matricNo || '';
  const pendingEmail = qpEmail || location.state?.email || user?.email || '';

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

  const performVerify = async () => {
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!pendingMatricNo) {
        setError('Missing matric number. Please log in and try again.');
        return;
      }
      const response = await authService.verifyEmail(pendingMatricNo, code);

      setMessage('Email verified successfully! Redirecting...');
      toast.success('Email verified! Redirecting…');

      const token = response?.data?.data?.token || response?.data?.token;

      if (token) {
        // Persist token and set canonical user in context, then navigate into app
        await authenticateWithToken(token);
        setShowOverlay(true);
        navigate('/', { state: { message: 'Welcome — your email is verified.' } });
      } else {
        // Fallback: go to login so user can sign-in manually
        setShowOverlay(true);
        navigate('/login', { state: { message: 'Email verified! You can now log in.' } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Verification failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!loading) await performVerify();
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    const code = verificationCode.join('');
    if (code.length === 6 && !loading) {
      // slight delay to allow last keystroke to render
      const t = setTimeout(() => {
        performVerify();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [verificationCode, loading]);

  // Paste handler to fill all boxes if user pastes a 6-digit code
  const handlePaste = (index, e) => {
    const pasted = e.clipboardData.getData('text');
    if (/^\d{2,}$/.test(pasted)) {
      e.preventDefault();
      const digits = pasted.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...verificationCode];
      for (let i = 0; i < digits.length; i++) {
        const pos = index + i;
        if (pos < 6) newCode[pos] = digits[i];
      }
      setVerificationCode(newCode);
      const nextPos = Math.min(index + digits.length, 5);
      const nextInput = document.getElementById(`verification-${nextPos}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      if (!pendingMatricNo) {
        setError('Missing matric number. Please log in and try again.');
        setLoading(false);
        return;
      }
      await authService.resendVerification(pendingMatricNo);
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
      <FullScreenLoader show={showOverlay} text="Setting up your account…" />
      <div className="verification-card">
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit verification code to your email address{pendingEmail ? ` (${pendingEmail})` : ''}</p>
        {location.state?.message && (
          <div className="info-message">{location.state.message}</div>
        )}
        
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
                onPaste={(e) => handlePaste(index, e)}
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