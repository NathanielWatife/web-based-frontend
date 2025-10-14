import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validateFullName } from '../../utils/validation';
import { validateMatricNo } from '../../utils/helpers';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    matricNo: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { register, error, loading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.matricNo) {
      newErrors.matricNo = 'Matric number is required';
    } else if (!validateMatricNo(formData.matricNo)) {
      newErrors.matricNo = 'Please enter a valid matric number (e.g., CST/2021/001)';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (!validateFullName(formData.fullName)) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register({
        matricNo: formData.matricNo,
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password
      });
    } catch (error) {
      // Error handling is done in the context
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Register
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Matric Number"
          name="matricNo"
          value={formData.matricNo}
          onChange={handleChange}
          error={!!errors.matricNo}
          helperText={errors.matricNo || 'Format: ABC/2021/001'}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={!!errors.fullName}
          helperText={errors.fullName}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          margin="normal"
          required
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
          size="large"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </Box>
    </Paper>
  );
};

export default RegisterForm;