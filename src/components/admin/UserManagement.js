import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/AdminManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      const params = filter === 'all' ? {} : { verified: filter === 'verified' };
      const response = await adminService.getAllUsers(params);
      const data = response.data?.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verification toggling removed as email verification is not used anymore

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(user => 
        filter === 'verified' ? user.isVerified : !user.isVerified
      );

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="admin-management">
      <div className="management-header">
        <h2>User Management</h2>
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      <div className="management-table">
        <div className="table-header">
          <div>User</div>
          <div>Matric No</div>
          <div>Faculty/Department</div>
          <div>Email</div>
          <div>Status</div>
          <div>Joined</div>
          <div>Actions</div>
        </div>

        {filteredUsers.map(user => (
          <div key={user._id} className="table-row">
            <div className="user-info">
              <strong>{user.firstName} {user.lastName}</strong>
              <small>Role: {user.role}</small>
            </div>
            <div className="matric-no">{user.matricNo}</div>
            <div className="faculty-dept">
              <div>{user.faculty}</div>
              <small>{user.department}</small>
            </div>
            <div className="email">{user.email}</div>
            <div className="status">
              <span className={`status-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                {user.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <div className="date">{formatDate(user.createdAt)}</div>
            <div className="actions">
              <span>-</span>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;