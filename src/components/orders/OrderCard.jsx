import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/helpers';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusText = {
      pending: 'Pending Payment',
      paid: 'Payment Confirmed',
      processing: 'Processing',
      ready: 'Ready for Pickup',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return statusText[status] || status;
  };

  const itemsCount = order.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Order Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.order_number}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex -space-x-2">
            {order.items?.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="w-10 h-12 bg-gray-200 rounded border-2 border-white overflow-hidden"
                style={{ zIndex: 3 - index }}
              >
                {item.book?.image ? (
                  <img
                    src={item.book.image}
                    alt={item.book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-3 h-4 bg-blue-300 mx-auto mb-1 rounded"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {order.items?.length > 3 && (
              <div className="w-10 h-12 bg-gray-100 rounded border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {itemsCount} item{itemsCount !== 1 ? 's' : ''}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {order.items?.[0]?.book?.title}
              {order.items?.length > 1 && ` and ${order.items.length - 1} more`}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Amount:</span>
            <p className="font-semibold text-gray-900">{formatCurrency(order.total_price)}</p>
          </div>
          <div>
            <span className="text-gray-600">Payment Method:</span>
            <p className="font-semibold text-gray-900 capitalize">
              {order.payment_method?.replace('_', ' ') || 'N/A'}
            </p>
          </div>
          {order.pickup_location && (
            <div className="col-span-2">
              <span className="text-gray-600">Pickup Location:</span>
              <p className="font-semibold text-gray-900">{order.pickup_location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Actions */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between">
          <Link
            to={`/orders/${order.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {order.status === 'ready' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Ready for Pickup
            </span>
          )}

          {order.status === 'pending' && (
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Complete Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;