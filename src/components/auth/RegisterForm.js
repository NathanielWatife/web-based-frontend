import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FACULTIES, DEPARTMENTS, STUDENT_LEVELS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/AuthForms.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    matricNo: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    faculty: '',
    department: '',
    programme: 'National Diploma',
    level: 'ND1',
    admissionYear: new Date().getFullYear().toString()
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    const { confirmPassword, ...submitData } = formData;
    const result = await register(submitData);

    setIsLoading(false);

    if (result.success) {
      // Navigate user to the email verification page with matricNo/email
      navigate('/verify-email', {
        state: {
          matricNo: submitData.matricNo,
          email: submitData.email,
          message: 'Registration successful! Enter the 6-digit code sent to your email to continue.'
        }
      });
    }
  };

  const availableDepartments = formData.faculty ? DEPARTMENTS[formData.faculty] : [];
  const filteredLevels = formData.programme === 'Higher National Diploma' 
    ? STUDENT_LEVELS.filter(l => l.startsWith('HND'))
    : STUDENT_LEVELS.filter(l => l.startsWith('ND'));

  return (
    <div className="auth-container">
      <div className="auth-card">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
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
            <label className="form-label">Email</label>
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
              onChange={handleChange}
              className="form-input"
              placeholder="F/ND/23/3210090"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Faculty</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Faculty</option>
                {FACULTIES.map(faculty => (
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
                required
                disabled={!formData.faculty}
              >
                <option value="">Select Department</option>
                {availableDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Programme</label>
              <select
                name="programme"
                value={formData.programme}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="National Diploma">National Diploma</option>
                <option value="Higher National Diploma">Higher National Diploma</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="form-select"
                required
              >
                {filteredLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Admission Year</label>
              <input
                type="number"
                name="admissionYear"
                value={formData.admissionYear}
                onChange={handleChange}
                className="form-input"
                min="2000"
                max={new Date().getFullYear()}
                required
              />
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
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Register'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;