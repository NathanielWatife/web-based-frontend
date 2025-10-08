import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';

const Dashboard = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      name: 'Total Orders',
      value: '1,248',
      change: '+12%',
      changeType: 'increase',
      icon: '📦',
      color: 'blue'
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(1258000),
      change: '+8%',
      changeType: 'increase',
      icon: '💰',
      color: 'green'
    },
    {
      name: 'Active Users',
      value: '2,847',
      change: '+5%',
      changeType: 'increase',
      icon: '👥',
      color: 'purple'
    },
    {
      name: 'Low Stock Items',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: '⚠️',
      color: 'red'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'order',
      description: 'New order #ORD-0012 placed',
      time: '2 minutes ago',
      user: 'John Doe'
    },
    {
      id: 2,
      type: 'payment',
      description: 'Payment confirmed for order #ORD-0011',
      time: '15 minutes ago',
      user: 'Jane Smith'
    },
    {
      id: 3,
      type: 'stock',
      description: 'Book "Advanced Calculus" is low in stock',
      time: '1 hour ago',
      user: 'System'
    },
    {
      id: 4,
      type: 'user',
      description: 'New user registration',
      time: '2 hours ago',
      user: 'Mike Johnson'
    }
  ];

  const getActivityIcon = (type) => {
    const icons = {
      order: '📦',
      payment: '💰',
      stock: '📚',
      user: '👤'
    };
    return icons[type] || '🔔';
  };

  const getActivityColor = (type) => {
    const colors = {
      order: 'bg-blue-100 text-blue-800',
      payment: 'bg-green-100 text-green-800',
      stock: 'bg-orange-100 text-orange-800',
      user: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="text-4xl">👋</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className={`text-sm mt-1 ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last week
                </p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.user}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/books"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📚</div>
              <h3 className="font-medium text-gray-900">Manage Books</h3>
              <p className="text-sm text-gray-600 mt-1">Add, edit, or remove books</p>
            </Link>

            <Link
              to="/admin/orders"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📦</div>
              <h3 className="font-medium text-gray-900">View Orders</h3>
              <p className="text-sm text-gray-600 mt-1">Process and manage orders</p>
            </Link>

            <Link
              to="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="font-medium text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600 mt-1">Manage users and roles</p>
            </Link>

            <Link
              to="/admin/categories"
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏷️</div>
              <h3 className="font-medium text-gray-900">Categories</h3>
              <p className="text-sm text-gray-600 mt-1">Manage book categories</p>
            </Link>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="font-medium text-green-900">API Service</p>
              <p className="text-sm text-green-700">Operational</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="font-medium text-green-900">Database</p>
              <p className="text-sm text-green-700">Connected</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="font-medium text-green-900">Payment Gateway</p>
              <p className="text-sm text-green-700">Active</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;