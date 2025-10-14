import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookCatalog from './pages/BookCatalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import OrderDetailsPage from './pages/OrderDetailsPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Books from './pages/admin/Books';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/books" element={<BookCatalog />} />
                  <Route path="/cart" element={<Cart />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/orders/:orderId" 
                    element={
                      <ProtectedRoute>
                        <OrderDetailsPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Admin Routes */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout />
                      </ProtectedRoute>
                    } 
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="books" element={<Books />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="users" element={<Users />} />
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;