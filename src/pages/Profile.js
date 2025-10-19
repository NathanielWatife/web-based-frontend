import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ProfileForm from '../components/profile/ProfileForm';

const Profile = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/profile' }} replace />;
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>
      </div>
      <ProfileForm />
    </div>
  );
};

export default Profile;