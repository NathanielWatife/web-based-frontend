import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import {
  Search,
  Block,
  CheckCircle
} from '@mui/icons-material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const fetchUsers = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setUsers([
            {
              _id: '1',
              matricNo: 'CST/2021/001',
              fullName: 'John Doe',
              email: 'john.doe@student.yabatech.edu.ng',
              role: 'student',
              isActive: true,
              createdAt: '2023-01-15'
            },
            {
              _id: '2',
              matricNo: 'CST/2021/002',
              fullName: 'Jane Smith',
              email: 'jane.smith@student.yabatech.edu.ng',
              role: 'student',
              isActive: true,
              createdAt: '2023-01-16'
            },
            {
              _id: '3',
              matricNo: 'ADM/001',
              fullName: 'Admin User',
              email: 'admin@yabatech.edu.ng',
              role: 'admin',
              isActive: true,
              createdAt: '2023-01-10'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.matricNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user._id === userId
          ? { ...user, isActive: !user.isActive }
          : user
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage student and admin accounts
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users by name, matric number, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Matric Number</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {user.matricNo}
                  </Typography>
                </TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color={user.isActive ? 'error' : 'success'}
                    onClick={() => handleToggleStatus(user._id)}
                    size="small"
                  >
                    {user.isActive ? <Block /> : <CheckCircle />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredUsers.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search terms' : 'No users in the system'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserManagement;