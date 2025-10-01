import React, { useState, useEffect } from 'react';
import './UserModal.css';

const UserModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: 'student',
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(!user);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        role: user.role || 'student',
        is_active: user.is_active !== undefined ? user.is_active : true
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleGeneratePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // In a real app, you would send this password via email
    alert(`Generated password: ${password}\n\nThis password should be sent to the user via secure email.`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? 'Edit User' : 'Add New User'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={errors.first_name ? 'error' : ''}
                placeholder="Enter first name"
                disabled={!isEditing && user}
              />
              {errors.first_name && <span className="error-text">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={errors.last_name ? 'error' : ''}
                placeholder="Enter last name"
                disabled={!isEditing && user}
              />
              {errors.last_name && <span className="error-text">{errors.last_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter email address"
                disabled={!isEditing && user}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number *</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={errors.phone_number ? 'error' : ''}
                placeholder="Enter phone number"
              />
              {errors.phone_number && <span className="error-text">{errors.phone_number}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? 'error' : ''}
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administrator</option>
              </select>
              {errors.role && <span className="error-text">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="is_active">Account Status</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Active Account
                </label>
                <small>Inactive users cannot log in to the system</small>
              </div>
            </div>
          </div>

          {!user && (
            <div className="password-section">
              <h4>Account Setup</h4>
              <p>For new users, you can generate a temporary password that will be sent to their email.</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGeneratePassword}
              >
                Generate Temporary Password
              </button>
            </div>
          )}

          {user && (
            <div className="user-info-section">
              <h4>User Information</h4>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Date Joined:</strong>
                  <span>{new Date(user.date_joined).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <strong>Last Login:</strong>
                  <span>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</span>
                </div>
                <div className="info-item">
                  <strong>Total Orders:</strong>
                  <span>{user.orders_count || 0}</span>
                </div>
                <div className="info-item">
                  <strong>Total Spent:</strong>
                  <span>₦{(user.total_spent || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            {user && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit User'}
              </button>
            )}
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={user && !isEditing}
            >
              {user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;