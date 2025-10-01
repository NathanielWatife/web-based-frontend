import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [personalData, setPersonalData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    user_type: 'student'
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setPersonalData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        user_type: user.role || 'student'
      });
    }
  }, [user]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call - replace with actual updateProfile function
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match.'
      });
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage({
        type: 'error',
        text: 'New password must be at least 6 characters.'
      });
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'Password updated successfully!'
      });
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update password. Please check your current password.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <LoadingSpinner text="Loading profile..." />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', name: 'Personal Information', icon: '👤' },
    { id: 'password', name: 'Change Password', icon: '🔒' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' }
  ];

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-content">
          {/* Sidebar Navigation */}
          <div className="profile-sidebar">
            <div className="user-summary">
              <div className="user-avatar">
                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
              </div>
              <div className="user-info">
                <h3>{user.first_name} {user.last_name}</h3>
                <p className="user-email">{user.email}</p>
                <p className="user-role">
                  {user.role === 'admin' ? 'Administrator' : 
                   user.role === 'staff' ? 'Staff Member' : 'Student'}
                </p>
              </div>
            </div>

            <nav className="profile-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span className="nav-text">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="profile-section">
                <h2>Personal Information</h2>
                <p>Update your personal details and contact information</p>

                <form onSubmit={handlePersonalSubmit} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="first_name">First Name *</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={personalData.first_name}
                        onChange={handlePersonalChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="last_name">Last Name *</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={personalData.last_name}
                        onChange={handlePersonalChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={personalData.email}
                      onChange={handlePersonalChange}
                      required
                    />
                    <small>Your email address is used for account notifications and order updates.</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={personalData.phone_number}
                      onChange={handlePersonalChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="user_type">Account Type</label>
                    <select
                      id="user_type"
                      name="user_type"
                      value={personalData.user_type}
                      onChange={handlePersonalChange}
                      disabled
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                      <option value="faculty">Faculty</option>
                    </select>
                    <small>Account type cannot be changed. Contact support for assistance.</small>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div className="profile-section">
                <h2>Change Password</h2>
                <p>Update your password to keep your account secure</p>

                <form onSubmit={handlePasswordSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="current_password">Current Password *</label>
                    <input
                      type="password"
                      id="current_password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="new_password">New Password *</label>
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <small>Password must be at least 6 characters long.</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm_password">Confirm New Password *</label>
                    <input
                      type="password"
                      id="confirm_password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-fill ${
                          passwordData.new_password.length >= 6 ? 'strong' : 'weak'
                        }`}
                        style={{ width: `${Math.min((passwordData.new_password.length / 6) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="strength-text">
                      {passwordData.new_password.length >= 6 ? 'Strong password' : 'Weak password'}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="profile-section">
                <h2>Account Preferences</h2>
                <p>Customize your experience and notification settings</p>

                <div className="preferences-list">
                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Email Notifications</h4>
                      <p>Receive email updates about your orders, promotions, and account activity</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>SMS Notifications</h4>
                      <p>Receive text messages for order updates and important announcements</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Promotional Emails</h4>
                      <p>Get notified about new books, special offers, and discounts</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Auto-save Cart</h4>
                      <p>Automatically save items in your cart for later</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="preference-actions">
                  <button className="btn btn-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;