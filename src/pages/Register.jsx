import React from 'react';
import { Container, Box, Typography, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <RegisterForm />
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" variant="body2">
              Sign in here
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;