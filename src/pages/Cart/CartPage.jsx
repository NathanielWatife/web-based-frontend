import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartItem from '../../components/cart/CartItem/CartItem';
import CartSummary from '../../components/cart/CartSummary/CartSummary';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './CartPage.css';


const CartPage = () => {
    const { CartItem, loading, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <div className="cart-page">
                <div className="container">
                    <h2>Authentication Required</h2>
                    <p>Please log in to view your cart.</p>
                    <div className="auth-actions">
                        <Link to="/login" className="btn btn-primary">Login</Link>
                        <Link to="/register" className="btn btn-secondary">Register</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="cart-page">
                <div className="container">
                    <LoadingSpinner text="Loading your cart..." />
                </div>
            </div>
        );
    }


    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            await clearCart();
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any books to your cart yet.</p>
                        <Link to="/books" className="btn btn-primary btn-large">Browse Books</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="conatiner">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p>Review your items and proceed to checkout</p>
                </div>

                <div className="cart-content">
                    <div className="cart-items-section">
                        <div className="cart-items-header">
                            <h2>Cart Items ({cartItems.length})</h2>
                            <button onClick={handleClearCart} className="btn btn-outline btn-small">Clear Cart</button>
                        </div>

                        <div className="cart-items-list">
                            {cartItems.map(item => (
                                <CartItem key={item.id || item.book.id} item={item} />
                            ))}
                        </div>

                        <div className="continue-shopping">
                            <Link to="/books" className="btn btn-outline">← Continue Shopping</Link>
                        </div>
                    </div>
                    <div className="cart-summary-sction">
                        <CartSummary onCheckout={handleCheckout} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CartPage;