import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import EmailVerification from './components/auth/EmailVerification';
import Cart from './components/cart/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import AdminDashboard from './components/admin/AdminDashboard';
import BookManagement from './components/admin/BookManagement';
import OrderManagement from './components/admin/OrderManagement';
import UserManagement from './components/admin/UserManagement';
import Reports from './components/admin/Reports';
import PasswordReset from './components/auth/PasswordReset';
import './styles/index.css';
import Chatbot from './components/common/Chatbot';
import SupportTickets from './components/admin/SupportTickets';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import { Toaster } from 'react-hot-toast';
import ActionPopup from './components/common/ActionPopup';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import RouteProgress from './components/common/RouteProgress';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Toaster position="top-center" gutter={8} />
            <Header />
            <RouteProgress />
            <ScrollToTop />
            <ErrorBoundary>
              <main>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/reset-password" element={<PasswordReset />} />

                {/* Protected Routes */}
                <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                <Route path="/orders/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/books" element={<AdminRoute><BookManagement /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />
                <Route path="/admin/tickets" element={<AdminRoute><SupportTickets /></AdminRoute>} />
                </Routes>
              </main>
            </ErrorBoundary>
            <ActionPopup />
            <Chatbot />
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;