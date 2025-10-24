import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FACULTIES, DEPARTMENTS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/ProfileForm.css';

const ProfileForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    faculty: '',
    department: '',
    matricNo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        faculty: user.faculty || '',
        department: user.department || '',
        matricNo: user.matricNo || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const availableDepartments = formData.faculty ? (DEPARTMENTS[formData.faculty] || []) : [];

  return (
    <div className="profile-form-container">
      <div className="profile-header">
        <h2>Profile Information</h2>
        <p>Update your personal information and preferences</p>
      </div>

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

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

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

        <div className="form-group">
          <label className="form-label">Matriculation Number</label>
          <input
            type="text"
            name="matricNo"
            value={formData.matricNo}
            className="form-input"
            disabled
            title="Matriculation number cannot be changed"
          />
          <small className="form-help">Matriculation number cannot be changed</small>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Faculty</label>
            <select
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Faculty</option>
              {(FACULTIES || []).map(faculty => (
                <option key={faculty} value={faculty}>{faculty}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-select"
              disabled={!formData.faculty}
            >
              <option value="">Select Department</option>
              {(availableDepartments || []).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-input"
            placeholder="+234 XXX XXX XXXX"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;