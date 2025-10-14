import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { Save, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    matricNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        matricNo: user.matricNo || ''
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const updatedUser = await authService.updateProfile(profileData);
      updateUser(updatedUser);
      
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Please log in to view your profile.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Person sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          My Profile
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Personal Information" />
          <Tab label="Order History" />
          <Tab label="Security" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Matric Number"
                  name="matricNo"
                  value={profileData.matricNo}
                  disabled
                  helperText="Matric number cannot be changed"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Order History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your past orders
          </Typography>
          {/* Order history component will be implemented separately */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Order history feature coming soon...
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Security Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your password and security preferences
          </Typography>
          {/* Password change component will be implemented separately */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Security settings feature coming soon...
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Profile;