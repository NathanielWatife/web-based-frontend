import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api/usersAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import UserModal from '../../components/admin/UserModal/UserModal';
import './UsersManagement.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockUsers = () => {
    return [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@student.yabatech.edu.ng',
        phone_number: '+2348012345678',
        role: 'student',
        is_active: true,
        date_joined: '2024-01-15T10:30:00Z',
        last_login: '2024-01-20T14:25:00Z',
        orders_count: 5,
        total_spent: 45200
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@staff.yabatech.edu.ng',
        phone_number: '+2348012345679',
        role: 'staff',
        is_active: true,
        date_joined: '2024-01-10T09:15:00Z',
        last_login: '2024-01-19T11:20:00Z',
        orders_count: 3,
        total_spent: 28700
      },
      {
        id: 3,
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@yabatech.edu.ng',
        phone_number: '+2348012345680',
        role: 'admin',
        is_active: true,
        date_joined: '2023-12-01T08:00:00Z',
        last_login: '2024-01-20T16:45:00Z',
        orders_count: 0,
        total_spent: 0
      },
      {
        id: 4,
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike.johnson@student.yabatech.edu.ng',
        phone_number: '+2348012345681',
        role: 'student',
        is_active: false,
        date_joined: '2024-01-08T14:20:00Z',
        last_login: '2024-01-12T10:15:00Z',
        orders_count: 1,
        total_spent: 7500
      },
      {
        id: 5,
        first_name: 'Sarah',
        last_name: 'Wilson',
        email: 'sarah.wilson@faculty.yabatech.edu.ng',
        phone_number: '+2348012345682',
        role: 'faculty',
        is_active: true,
        date_joined: '2024-01-05T11:45:00Z',
        last_login: '2024-01-18T13:30:00Z',
        orders_count: 2,
        total_spent: 16800
      }
    ];
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      try {
        // Simulate API call
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_active: !currentStatus } : user
        ));
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // Simulate API call
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...userData } : user
        ));
      } else {
        // Add new user
        const newUser = {
          ...userData,
          id: Math.max(...users.map(u => u.id)) + 1,
          date_joined: new Date().toISOString(),
          last_login: null,
          orders_count: 0,
          total_spent: 0
        };
        setUsers([...users, newUser]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: 'Admin', class: 'admin' },
      staff: { label: 'Staff', class: 'staff' },
      faculty: { label: 'Faculty', class: 'faculty' },
      student: { label: 'Student', class: 'student' }
    };
    
    const config = roleConfig[role] || { label: role, class: 'default' };
    return <span className={`role-badge ${config.class}`}>{config.label}</span>;
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <span className="status-badge active">Active</span> :
      <span className="status-badge inactive">Inactive</span>;
  };

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(user => user.is_active).length;
    const students = users.filter(user => user.role === 'student').length;
    const staff = users.filter(user => user.role === 'staff').length;
    const faculty = users.filter(user => user.role === 'faculty').length;
    const admins = users.filter(user => user.role === 'admin').length;

    return { total, active, students, staff, faculty, admins };
  };

  const stats = getUserStats();

  return (
    <div className="users-management">
      <div className="management-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>
        <button className="btn btn-primary btn-large" onClick={handleAddUser}>
          + Add New User
        </button>
      </div>

      {/* User Statistics */}
      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-icon total">👥</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">✅</div>
          <div className="stat-info">
            <h3>{stats.active}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon students">🎓</div>
          <div className="stat-info">
            <h3>{stats.students}</h3>
            <p>Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon staff">👨‍💼</div>
          <div className="stat-info">
            <h3>{stats.staff + stats.faculty}</h3>
            <p>Staff & Faculty</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon admins">⚙️</div>
          <div className="stat-info">
            <h3>{stats.admins}</h3>
            <p>Admins</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="management-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="staff">Staff</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="stats-summary">
          <span className="stat">Showing: {filteredUsers.length}</span>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User Information</th>
                <th>Role</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                      </div>
                      <div className="user-details">
                        <h4>{user.first_name} {user.last_name}</h4>
                        <p className="user-email">{user.email}</p>
                        <p className="user-phone">{user.phone_number}</p>
                        <p className="user-joined">
                          Joined {formatDate(user.date_joined)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {getRoleBadge(user.role)}
                  </td>
                  <td>
                    {getStatusBadge(user.is_active)}
                  </td>
                  <td className="orders-cell">
                    <span className="orders-count">{user.orders_count}</span>
                  </td>
                  <td className="spent-cell">
                    {formatPrice(user.total_spent)}
                  </td>
                  <td className="login-cell">
                    {formatDate(user.last_login)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action edit"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        ✏️
                      </button>
                      <button
                        className={`btn-action ${user.is_active ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                        title={user.is_active ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.is_active ? '⏸️' : '▶️'}
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          className="btn-action delete"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      )}
                      <button
                        className="btn-action view"
                        title="View Details"
                      >
                        👁️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No users found</h3>
              <p>Try adjusting your search criteria or add a new user.</p>
              <button className="btn btn-primary" onClick={handleAddUser}>
                Add Your First User
              </button>
            </div>
          )}
        </div>
      )}

      {/* User Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UsersManagement;