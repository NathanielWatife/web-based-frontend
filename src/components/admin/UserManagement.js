import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/AdminManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Simulate API call - this would be an admin endpoint
      const mockUsers = [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@student.yabatech.edu.ng',
          matricNo: 'F/ND/23/321001',
          faculty: 'School of Technology',
          department: 'Computer Science',
          isVerified: true,
          role: 'student',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@student.yabatech.edu.ng',
          matricNo: 'F/HND/23/321002',
          faculty: 'School of Business',
          department: 'Business Administration',
          isVerified: true,
          role: 'student',
          createdAt: '2024-01-16T11:00:00Z'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (userId) => {
    try {
      // Simulate API call to toggle verification
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, isVerified: !user.isVerified }
          : user
      ));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

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
              <button 
                onClick={() => toggleVerification(user._id)}
                className={`btn ${user.isVerified ? 'btn-outline' : 'btn-primary'}`}
              >
                {user.isVerified ? 'Unverify' : 'Verify'}
              </button>
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