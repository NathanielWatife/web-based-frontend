import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import AdminRoutes from './AdminRoutes';
import OrderConfirmation from '../pages/Checkout/OrderConfirmation';
import Wishlist from '../pages/User/Wishlist';
import MyReviews from '../pages/User/MyReviews';

// Pages
import Home from '../pages/Home/Home';
import BookCatalog from '../pages/Books/BookCatalog';
import BookDetailPage from '../pages/Books/BookDetailPage';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import CartPage from '../pages/Cart/CartPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import Profile from '../pages/User/Profile';
import OrderHistory from '../pages/User/OrderHistory';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import NotFound from '../pages/Shared/NotFound';

// Layout Components
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';

const AppRoutes = () => {
    return (
        <>
            <Header />
                <main style={{ minHeight: '80vh' }}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/books" element={<BookCatalog />} />
                        <Route path="/books/:id" element={<BookDetailPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* Protected User Routes */}
                        <Route element={<PrivateRoutes />}>
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/orders" element={<OrderHistory />} />
                        <Route path="/order-confirmation" element={<OrderConfirmation />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/my-reviews" element={<MyReviews />} />
                    </Route>
                    {/* Admin Routes */}
                    <Route element={<AdminRoutes />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            <Footer />
        </>
    );
};

export default AppRoutes;