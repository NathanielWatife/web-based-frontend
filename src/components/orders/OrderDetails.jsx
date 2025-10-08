import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { ordersAPI } from '../../services/orders';
import { formatCurrency, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../shared/LoadingSpinner';

const OrderDetails = () => {
  const { id } = useParams();
  const { data: order, loading, error } = useApi(() => ordersAPI.getOrder(id));

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const statusText = {
      pending: 'Pending Payment',
      paid: 'Payment Confirmed',
      processing: 'Processing Order',
      ready: 'Ready for Pickup',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return statusText[status] || status;
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      pending: 'Waiting for payment confirmation',
      paid: 'Payment received, preparing your order',
      processing: 'Your books are being gathered',
      ready: 'Your order is ready for pickup',
      completed: 'Order has been completed',
      cancelled: 'Order has been cancelled'
    };
    return descriptions[status] || 'Order status updated';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Order Not Found
        </div>
        <p className="text-gray-600 mb-4">
          {error?.message || 'The order you are looking for does not exist.'}
        </p>
        <Link
          to="/orders"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.order_number}
            </h1>
            <p className="text-gray-600">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-lg border-2 text-sm font-semibold ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>

        {/* Status Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-blue-800 font-medium">{getStatusDescription(order.status)}</p>
              {order.status === 'ready' && (
                <p className="text-blue-700 text-sm mt-1">
                  Please bring your student ID to {order.pickup_location} for pickup.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {order.items?.map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    {/* Book Image */}
                    <div className="flex-shrink-0 w-16 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      {item.book?.image ? (
                        <img
                          src={item.book.image}
                          alt={item.book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-4 h-6 bg-blue-300 mx-auto mb-1 rounded"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/books/${item.book?.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600"
                      >
                        {item.book?.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        by {item.book?.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(item.price)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
            {/* Order Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Order Number:</span>
                  <p className="font-medium text-gray-900">{order.order_number}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Order Date:</span>
                  <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.payment_method?.replace('_', ' ') || 'N/A'}
                  </p>
                </div>
                
                {order.payment_reference && (
                  <div>
                    <span className="text-sm text-gray-600">Payment Reference:</span>
                    <p className="font-medium text-gray-900 text-sm">{order.payment_reference}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pickup Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Location:</span>
                  <p className="font-medium text-gray-900">{order.pickup_location}</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-yellow-800">
                      Bring your student ID for verification
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">
                    {formatCurrency(order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-blue-600">{formatCurrency(order.total_price)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-2">
                If you have any questions about your order, please contact:
              </p>
              <div className="text-sm">
                <p className="text-blue-600">bookstore@yabatech.edu.ng</p>
                <p className="text-gray-600">+234 800 000 0000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;