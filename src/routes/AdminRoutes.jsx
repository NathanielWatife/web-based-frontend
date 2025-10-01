import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoutes = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;