import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: '📊',
      description: 'Overview and statistics'
    },
    {
      name: 'Book Management',
      path: '/admin/books',
      icon: '📚',
      description: 'Manage books and inventory'
    },
    {
      name: 'Order Management',
      path: '/admin/orders',
      icon: '📦',
      description: 'View and manage orders'
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: '👥',
      description: 'Manage users and roles'
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: '🏷️',
      description: 'Manage book categories'
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">Management Dashboard</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`block p-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs text-gray-500 truncate">
                  {item.description}
                </div>
              </div>
              {isActive(item.path) && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Today's Orders:</span>
            <span className="font-semibold">12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Low Stock:</span>
            <span className="font-semibold text-orange-600">5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending Orders:</span>
            <span className="font-semibold text-blue-600">8</span>
          </div>
        </div>
      </div>

      {/* Back to Store */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link
          to="/"
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Store</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;